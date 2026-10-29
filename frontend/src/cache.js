// Storage cache utility for instant page hydration on refresh
export const STORAGE_KEYS = {
    SETTINGS: 'ceylanme_cached_settings',
    DESTINATIONS: 'ceylanme_cached_destinations',
    BLOGS: 'ceylanme_cached_blogs'
};

export const getCachedData = (key, fallback = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
};

export const setCachedData = (key, data) => {
    try {
        if (data) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    } catch (e) {
        console.debug('Storage error:', e);
    }
};

// Aynı public GET isteği eşzamanlı birden çok bileşenden gelirse tek istek paylaşılır.
// Backend soğuk başlangıçtayken aynı veri için 3 ayrı bekleyen istek oluşmasını önler.
// Admin oturumunda (token) paylaşım yapılmaz.
const inflight = new Map();
const SHARED_TTL = 15000;
export const sharedGet = (axiosInstance, url, config = {}) => {
    let hasToken = false;
    try { hasToken = !!localStorage.getItem('token'); } catch (e) { /* ignore */ }
    if (hasToken) return axiosInstance.get(url, config);

    const hit = inflight.get(url);
    if (hit && Date.now() - hit.at < SHARED_TTL) return hit.promise;

    const promise = axiosInstance.get(url, config);
    inflight.set(url, { at: Date.now(), promise });
    promise.catch(() => { if (inflight.get(url)?.promise === promise) inflight.delete(url); });
    return promise;
};

// Build sırasında üretilen statik snapshot'ı (Vercel CDN) okur. Yoksa/bozuksa null döner.
export const fetchSnapshot = async (relPath, validate) => {
    try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 8000);
        const res = await fetch(`/snapshot/${relPath}`, { signal: ctl.signal });
        clearTimeout(t);
        if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) return null;
        const data = await res.json();
        return validate(data) ? data : null;
    } catch (e) {
        return null;
    }
};

export const DEFAULT_STATIC_REGIONS = [
    { _id: 'def-tr', name: 'TÜRKİYE', isRegion: true },
    { _id: 'def-af', name: 'AFRİKA', isRegion: true },
    { _id: 'def-as', name: 'ASYA', isRegion: true },
    { _id: 'def-eu', name: 'AVRUPA', isRegion: true },
    { _id: 'def-sa', name: 'GÜNEY AMERİKA', isRegion: true },
    { _id: 'def-na', name: 'KUZEY AMERİKA', isRegion: true }
];
