// Build sırasında yayınlanmış yazıları statik JSON'a çevirir (public/snapshot).
// Vercel CDN'den anında servis edilir; backend uyuyor olsa bile ilk ziyaretçi içeriği görür.
// Güvenlik: yalnızca herkese açık, token'sız API yanıtları kullanılır; taslaklar zaten gelmez
// ve ayrıca isDraft olanlar burada da elenir. Hata olursa build ASLA başarısız olmaz.
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = (process.env.VITE_API_URL || 'https://travel-blog-wfkm.onrender.com').trim().replace(/\/$/, '');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'snapshot');
const TIMEOUT_MS = 90000; // soğuk başlangıç için yeterince uzun, ama sonsuz değil

const get = async (p) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
        const res = await fetch(`${API}${p}`, { signal: ctl.signal });
        if (!res.ok) throw new Error(`${p} -> ${res.status}`);
        return await res.json();
    } finally {
        clearTimeout(t);
    }
};

const FIELDS = ['_id', 'title', 'content', 'image', 'imagePosition', 'destination', 'metaTitle', 'metaDescription', 'createdAt', 'updatedAt'];
const pick = (b) => Object.fromEntries(FIELDS.filter((k) => b[k] !== undefined).map((k) => [k, b[k]]));
const excerpt = (b) => ({ ...pick(b), content: String(b.content || '').replace(/<[^>]*>?/gm, '').substring(0, 300) });

try {
    const [list, settings, destinations] = await Promise.all([
        get('/api/blogs?limit=200'),
        get('/api/settings'),
        get('/api/destinations'),
    ]);
    const all = (Array.isArray(list) ? list : list.blogs || []).filter((b) => b && b._id && !b.isDraft);
    if (all.length === 0) throw new Error('boş blog listesi, snapshot yazılmadı');

    await rm(OUT, { recursive: true, force: true });
    await mkdir(path.join(OUT, 'blog'), { recursive: true });

    await Promise.all(all.map((b) => writeFile(path.join(OUT, 'blog', `${b._id}.json`), JSON.stringify(pick(b)))));
    await writeFile(path.join(OUT, 'home.json'), JSON.stringify({
        generatedAt: new Date().toISOString(),
        blogs: all.slice(0, 12).map(excerpt),
        totalBlogs: all.length,
        settings,
        destinations,
    }));
    console.log(`[snapshot] ${all.length} yazı, ayarlar ve ${destinations.length} destinasyon yazıldı.`);
} catch (err) {
    console.warn('[snapshot] Atlandı (build devam ediyor):', err.message);
}
