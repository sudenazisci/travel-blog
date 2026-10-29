import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';
import BeachLoader from '../components/BeachLoader';
import { Calendar, Share2, Copy, Check, ArrowLeft, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';
import { fetchSnapshot } from '../cache';

// Public, published-post cache. Never stores drafts or anything fetched with admin credentials.
const CACHE_PREFIX = 'blogCache:v1:';
const CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT = 60000; // Render cold start can take ~50s; never wait forever
const CACHE_FIELDS = ['_id', 'title', 'content', 'image', 'destination', 'metaTitle', 'metaDescription', 'createdAt', 'updatedAt', 'isDraft'];

const isAdminSession = () => {
    try { return !!localStorage.getItem('token'); } catch { return false; }
};

const readCache = (id) => {
    try {
        if (isAdminSession()) return null;
        const raw = localStorage.getItem(CACHE_PREFIX + id);
        if (!raw) return null;
        const { savedAt, data } = JSON.parse(raw);
        if (!data || data.isDraft || typeof data.content !== 'string' || !data.title || Date.now() - savedAt > CACHE_MAX_AGE) {
            localStorage.removeItem(CACHE_PREFIX + id);
            return null;
        }
        return data;
    } catch {
        return null;
    }
};

const writeCache = (id, blog) => {
    try {
        if (isAdminSession() || !blog || blog.isDraft) return;
        const data = {};
        CACHE_FIELDS.forEach((k) => { if (blog[k] !== undefined) data[k] = blog[k]; });
        localStorage.setItem(CACHE_PREFIX + id, JSON.stringify({ savedAt: Date.now(), data }));
    } catch { /* quota/private mode: ignore */ }
};

const clearCache = (id) => {
    try { localStorage.removeItem(CACHE_PREFIX + id); } catch { /* ignore */ }
};

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(() => readCache(id));
    const [allBlogs, setAllBlogs] = useState([]);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null); // 'notfound' | 'failed' | null
    const [retry, setRetry] = useState(0);
    const viewIncremented = React.useRef(false);

    useEffect(() => {
        let cancelled = false;
        const cached = readCache(id);
        setBlog(cached);
        setError(null);
        let apiDone = false;

        // Tarayıcı önbelleği yoksa: build sırasında üretilen CDN snapshot'ı hemen göster.
        // (Backend uyuyor olsa bile içerik anında gelir; API yanıtı gelince güncellenir.)
        if (!cached && !isAdminSession() && /^[a-f0-9]{24}$/i.test(id)) {
            fetchSnapshot(`blog/${id}.json`, (d) => d && d._id === id && typeof d.content === 'string' && d.title && !d.isDraft)
                .then((snap) => { if (snap && !cancelled && !apiDone) setBlog(snap); });
        }

        // Fetch blog detail (revalidates in background when cached)
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/blogs/${id}`, { timeout: FETCH_TIMEOUT });
                apiDone = true;
                if (cancelled) return;
                setBlog(res.data);
                setError(null);
                if (res.data && res.data.isDraft) clearCache(id);
                else writeCache(id, res.data);

                if (!viewIncremented.current && !res.data.isDraft && !localStorage.getItem('token') && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
                    viewIncremented.current = true;
                    await axios.post(`${API_BASE}/api/blogs/${id}/view`).catch(() => { });
                }
            } catch (err) {
                console.error('Error fetching blog detail:', err);
                if (cancelled) return;
                const status = err.response && err.response.status;
                if (status === 404) {
                    clearCache(id);
                    setBlog(null);
                    setError('notfound');
                } else if (!cached) {
                    setError('failed'); // with a cache we keep showing the cached post
                }
            }
        };

        // Fetch navigation blogs after blog is loaded (non‑blocking for the detail view)
        const fetchAllBlogs = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/blogs?limit=50&excerpt=1`);
                setAllBlogs(res.data.blogs || res.data || []);
            } catch (err) {
                console.error('Error fetching blogs for navigation:', err);
            }
        };

        fetchBlog();
        // Load navigation list asynchronously; it does not block rendering of the blog content
        fetchAllBlogs();

        return () => {
            cancelled = true;
        };
    }, [id, retry]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    const handleNativeShare = async () => {
        if (navigator.share && blog) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.metaDescription || blog.title,
                    url: window.location.href,
                });
            } catch (e) {
                console.debug('Share cancelled:', e);
            }
        } else {
            handleCopyLink();
        }
    };

    if (!blog) return (
        <div className="flex items-center justify-center min-h-screen bg-[#FBF9F5] px-6">
            {error ? (
                <div className="text-center max-w-md" role="alert">
                    <div className="font-serif text-2xl text-[#1A1918] mb-3">
                        {error === 'notfound' ? 'Yazı bulunamadı' : 'Yazı şu an yüklenemedi'}
                    </div>
                    <p className="font-serif text-[#4A4744] mb-6">
                        {error === 'notfound'
                            ? 'Aradığın yazı kaldırılmış ya da yayından alınmış olabilir.'
                            : 'Sunucuya ulaşılamadı veya yanıt çok uzun sürdü. Lütfen tekrar dene.'}
                    </p>
                    <div className="flex items-center justify-center gap-4 font-mono text-xs uppercase tracking-widest">
                        {error !== 'notfound' && (
                            <button onClick={() => setRetry((n) => n + 1)} className="px-4 py-3 bg-[#1A1918] text-[#FBF9F5] hover:bg-[#A34828] transition-colors min-h-[44px]">
                                Tekrar Dene
                            </button>
                        )}
                        <Link to="/" className="text-[#A34828] hover:underline min-h-[44px] inline-flex items-center">Ana Sayfa</Link>
                    </div>
                </div>
            ) : (
                <BeachLoader label="Yazı Yükleniyor" />
            )}
        </div>
    );

    const currentIndex = (allBlogs || []).findIndex(b => b && blog && b._id === blog._id);
    const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
    const nextPost = (currentIndex >= 0 && currentIndex < allBlogs.length - 1) ? allBlogs[currentIndex + 1] : null;

    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(blog.title);

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": [blog.image],
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
        "author": [{
            "@type": "Person",
            "name": "Ceylan",
            "url": window.location.href
        }]
    };

    return (
        <div className="bg-[#FBF9F5] text-[#1A1918] min-h-screen flex flex-col justify-between selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <div>
                <SEO
                    title={blog.metaTitle || blog.title}
                    description={blog.metaDescription || (blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160) : '')}
                    image={blog.image}
                    schema={schema}
                />
                <Navbar />

                <main className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 w-full">

                    {/* Back Link */}
                    <div className="mb-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#78746D] hover:text-[#A34828] transition-colors uppercase tracking-widest min-h-[44px]"
                        >
                            <ArrowLeft size={14} />
                            <span>Tüm Rotalara Dön</span>
                        </Link>
                    </div>

                    {/* Article */}
                    <article className="border-t border-[#1A1918]/15 pt-8">

                        {/* Header */}
                        <header className="mb-10 text-center max-w-3xl mx-auto">
                            {blog.destination && (
                                <Link
                                    to={`/destination/${(typeof blog.destination === 'object' && blog.destination ? blog.destination._id : blog.destination) || ''}`}
                                    className="inline-block font-mono text-xs font-bold text-[#A34828] uppercase tracking-[0.25em] mb-4 hover:underline"
                                >
                                    {(typeof blog.destination === 'object' && blog.destination ? blog.destination.name : 'Destinasyon') || 'Destinasyon'}
                                </Link>
                            )}

                            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1A1918] leading-[1.12] tracking-tight mb-6">
                                {blog.title}
                            </h1>

                            {blog.metaDescription && (
                                <p className="font-serif italic text-lg sm:text-xl text-[#4A4744] font-light leading-relaxed mb-6">
                                    “{blog.metaDescription}”
                                </p>
                            )}

                            <div className="flex items-center justify-center gap-6 font-mono text-xs text-[#78746D] uppercase tracking-wider pt-2 border-t border-b border-[#1A1918]/10 py-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={13} className="text-[#A34828]" />
                                    <time dateTime={blog.createdAt}>
                                        {new Date(blog.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </time>
                                </div>

                                <span>•</span>

                                <button
                                    onClick={handleNativeShare}
                                    className="inline-flex items-center gap-1.5 hover:text-[#A34828] transition-colors font-bold min-h-[44px]"
                                    aria-label="Yazıyı Paylaş"
                                >
                                    <Share2 size={13} />
                                    <span>Paylaş</span>
                                </button>
                            </div>
                        </header>

                        {/* Cover Image */}
                        {blog.image && (
                            <div className="mb-12 overflow-hidden bg-[#F4F0E8] aspect-[21/9] sm:aspect-[16/9] w-full border border-[#1A1918]/15">
                                <img
                                    src={blog.image.startsWith('http') ? blog.image : `${API_BASE}${blog.image}`}
                                    alt={blog.title}
                                    loading="eager"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80'; }}
                                />
                            </div>
                        )}

                        {/* Content & In-Article Sponsorship Banner */}
                        <div className="bg-[#FBF9F5] border border-[#1A1918]/12 rounded-sm p-6 sm:p-10 md:p-12 shadow-sm my-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A34828] via-[#1A1918] to-[#A34828]"></div>

                            <div className="max-w-[760px] mx-auto blog-content-editorial first-letter-dropcap">
                                <div
                                    className="blog-content-body"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* In-Article Sponsorship Box Corner */}
                                <div className="pt-8 mt-8 border-t border-[#1A1918]/10">
                                    <AdBanner location="in_post" />
                                </div>
                            </div>
                        </div>

                        {/* Share Bar: ONLY Social Media Icons */}
                        <div className="mt-12 pt-8 border-t border-[#1A1918]/15">
                            <div className="bg-[#F4F0E8] p-6 border border-[#1A1918]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#A34828] block mb-1">
                                        İÇERİĞİ PAYLAŞ
                                    </span>
                                    <h4 className="font-serif text-lg font-normal text-[#1A1918]">
                                        İlhamı Arkadaşlarınla Paylaş
                                    </h4>
                                </div>

                                {/* ONLY ICONS (WhatsApp, Twitter/X, Facebook, LinkedIn, Copy Link) */}
                                <div className="flex items-center gap-2">
                                    <a
                                        href={`https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[#1A1918] hover:bg-[#A34828] text-[#FBF9F5] flex items-center justify-center transition-colors border border-[#1A1918]/15"
                                        title="WhatsApp'ta Paylaş"
                                        aria-label="WhatsApp"
                                    >
                                        <MessageCircle size={18} />
                                    </a>

                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[#FBF9F5] hover:bg-[#A34828] text-[#1A1918] hover:text-[#FBF9F5] flex items-center justify-center transition-colors border border-[#1A1918]/20"
                                        title="Twitter / X'te Paylaş"
                                        aria-label="Twitter / X"
                                    >
                                        <Twitter size={18} />
                                    </a>

                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[#FBF9F5] hover:bg-[#A34828] text-[#1A1918] hover:text-[#FBF9F5] flex items-center justify-center transition-colors border border-[#1A1918]/20"
                                        title="Facebook'ta Paylaş"
                                        aria-label="Facebook"
                                    >
                                        <Facebook size={18} />
                                    </a>

                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-[#FBF9F5] hover:bg-[#A34828] text-[#1A1918] hover:text-[#FBF9F5] flex items-center justify-center transition-colors border border-[#1A1918]/20"
                                        title="LinkedIn'de Paylaş"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin size={18} />
                                    </a>

                                    <button
                                        onClick={handleCopyLink}
                                        className="w-10 h-10 bg-[#FBF9F5] hover:bg-[#A34828] text-[#1A1918] hover:text-[#FBF9F5] flex items-center justify-center transition-colors border border-[#1A1918]/20 cursor-pointer"
                                        title={copied ? "Bağlantı Kopyalandı" : "Bağlantıyı Kopyala"}
                                        aria-label="Bağlantıyı Kopyala"
                                    >
                                        {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Adjacent Posts */}
                        {(prevPost || nextPost) && (
                            <div className="mt-12 pt-8 border-t border-[#1A1918]/15 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {prevPost ? (
                                    <Link
                                        to={`/blog/${prevPost._id}`}
                                        className="p-5 border border-[#1A1918]/15 bg-[#F4F0E8] hover:border-[#A34828] transition-colors group flex flex-col justify-between"
                                    >
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A34828] mb-2 block">
                                            ← ÖNCEKİ YAZI
                                        </span>
                                        <h5 className="font-serif text-lg text-[#1A1918] group-hover:text-[#A34828] transition-colors line-clamp-1">
                                            {prevPost.title}
                                        </h5>
                                    </Link>
                                ) : <div />}

                                {nextPost ? (
                                    <Link
                                        to={`/blog/${nextPost._id}`}
                                        className="p-5 border border-[#1A1918]/15 bg-[#F4F0E8] hover:border-[#A34828] transition-colors group flex flex-col justify-between text-right"
                                    >
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#A34828] mb-2 block">
                                            SONRAKİ YAZI →
                                        </span>
                                        <h5 className="font-serif text-lg text-[#1A1918] group-hover:text-[#A34828] transition-colors line-clamp-1">
                                            {nextPost.title}
                                        </h5>
                                    </Link>
                                ) : <div />}
                            </div>
                        )}

                    </article>

                </main>
            </div>

            <Footer />
        </div>
    );
};

export default BlogDetail;
