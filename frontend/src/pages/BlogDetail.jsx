import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AdBanner from '../components/AdBanner';
import { Calendar, Share2, Copy, Check, ArrowLeft, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [copied, setCopied] = useState(false);
    const viewIncremented = React.useRef(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/blogs/${id}`);
                setBlog(res.data);

                if (!viewIncremented.current) {
                    viewIncremented.current = true;
                    await axios.post(`${API_BASE}/api/blogs/${id}/view`).catch(() => {});
                }
            } catch (err) {
                console.error('Error fetching blog detail:', err);
            }
        };

        const fetchAllBlogs = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/blogs?limit=50`);
                setAllBlogs(res.data.blogs || res.data || []);
            } catch (err) {
                console.error('Error fetching blogs for navigation:', err);
            }
        };

        fetchBlog();
        fetchAllBlogs();
    }, [id]);

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
        <div className="flex items-center justify-center min-h-screen bg-[#FBF9F5]">
            <div className="font-mono text-xs text-[#A34828] uppercase tracking-widest">Yazı Yükleniyor...</div>
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
                        <div className="max-w-[720px] mx-auto text-[#1A1918] leading-relaxed font-sans text-base sm:text-lg space-y-6 first-letter-dropcap prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#1A1918] prose-a:text-[#A34828] prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:border-l-2 prose-blockquote:border-[#A34828]">
                            <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>

                            {/* In-Article Sponsorship Box Corner */}
                            <div className="pt-6">
                                <AdBanner location="in_post" />
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
