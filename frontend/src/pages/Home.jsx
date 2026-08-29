import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, ArrowRight, Instagram, Youtube, Megaphone } from 'lucide-react';
import SEO from '../components/SEO';
import FeaturedBlogSlider from '../components/FeaturedBlogSlider';

const WorldMap = React.lazy(() => import('../components/WorldMap'));

const DEFAULT_SETTINGS = {
    siteTitle: 'Ceylan.m.e.',
    heroTitle: 'Dünyayı Keşfetmek İçin Yoldayız',
    heroSubtitle: 'Bilinmeyen rotaların heyecanı, antik sokakların fısıltısı ve yerel kültürlerin sıcaklığı...',
    instagramFollowerCount: '104 Bin',
};

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalBlogs: 0
    });
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const navigate = useNavigate();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('search') || '';

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            const params = new URLSearchParams(location.search);
            params.set('page', newPage);
            navigate(`/?${params.toString()}`);
            
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search') || '';
        const page = parseInt(params.get('page')) || 1;
        const limit = 4;

        const fetchBlogs = async () => {
            try {
                let url = `${API_BASE}/api/blogs?page=${page}&limit=${limit}`;
                if (query) url += `&search=${query}`;

                const res = await axios.get(url);
                if (res.data.blogs) {
                    setBlogs(res.data.blogs);
                    setPagination({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages,
                        totalBlogs: res.data.totalBlogs
                    });
                } else {
                    setBlogs(res.data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchBlogs();
    }, [location.search]);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/settings`);
                setSettings(res.data);
            } catch (error) { console.error(error); }
        };
        fetchSettings();
    }, []);

    const instagramAvatar = settings?.instagramPreviewImage
        ? (settings.instagramPreviewImage.startsWith('http')
            ? settings.instagramPreviewImage.replace('http://localhost:5000', API_BASE)
            : settings.instagramPreviewImage.startsWith('/uploads')
                ? `${API_BASE}${settings.instagramPreviewImage}`
                : settings.instagramPreviewImage)
        : '/youtube-avatar.jpg';

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <SEO
                title={settings?.siteTitle || "Ana Sayfa — Ceylan.m.e."}
                description={settings?.heroSubtitle || "Kişisel seyahat günlüğü ve rota rehberi"}
            />
            <Navbar />

            {/* Hero Cover Story Slider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <FeaturedBlogSlider blogs={blogs} featuredBlogs={settings?.featuredBlogs} />
            </div>

            {/* Announcement Ticker */}
            <div className="mb-10 border-y border-[#1A1918]/15 py-2 overflow-hidden relative flex bg-[#F4F0E8]">
                <style>{`
                    @keyframes scrollText {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-scroll {
                        animation: scrollText 60s linear infinite;
                    }
                `}</style>
                <div className="animate-scroll whitespace-nowrap flex items-center font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1A1918]">
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="mx-8 flex items-center gap-4">
                            <span>{settings?.announcement || "VIETNAM VE TAYLAND SEYAHAT REHBERİ ÇOK YAKINDA"}</span>
                            <span className="text-[#A34828]">•</span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Main Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
                    
                    {/* Main Content List (3/4) */}
                    <main className="w-full lg:w-3/4">

                        <div id="blog-section" className="flex items-end justify-between pb-3 mb-6 border-b border-[#1A1918]/15 scroll-mt-20">
                            <div>
                                <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.2em] block mb-0.5">
                                    SEYAHAT YAZILARI
                                </span>
                                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1918]">
                                    {searchQuery ? `"${searchQuery}" Sonuçları` : "Son Eklenen Gezi Rehberleri"}
                                </h2>
                            </div>
                            <span className="font-mono text-[11px] text-[#78746D] hidden sm:block">
                                Toplam {pagination.totalBlogs || blogs.length} İçerik
                            </span>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="py-12 text-center border border-[#1A1918]/15 bg-[#F4F0E8] p-6">
                                <p className="font-serif text-lg text-[#1A1918] mb-1">Henüz bu kategoride yazı bulunamadı.</p>
                                <p className="font-mono text-xs text-[#78746D]">Farklı bir arama yapabilir veya anasayfaya dönebilirsiniz.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {blogs.map((blog, index) => (
                                    <React.Fragment key={blog._id}>
                                        <article className="group flex flex-col h-full cursor-pointer pb-5 border-b border-[#1A1918]/15">
                                            <Link to={`/blog/${blog._id}`} className="block relative overflow-hidden bg-[#F4F0E8] aspect-[16/9] mb-3 border border-[#1A1918]/10">
                                                <img
                                                    src={blog.image ? (blog.image.startsWith('http') ? blog.image : `${API_BASE}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`) : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80'}
                                                    alt={blog.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover img-editorial-zoom"
                                                    style={{ objectPosition: `center ${blog.imagePosition || '50%'}` }}
                                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'; }}
                                                />
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="font-mono text-[9px] font-bold text-[#1A1918] bg-[#FBF9F5] px-2.5 py-0.5 uppercase tracking-widest border border-[#1A1918]/15">
                                                        {blog.destination?.name || 'Seyahat'}
                                                    </span>
                                                </div>
                                            </Link>

                                            <div className="flex-1 flex flex-col justify-between space-y-2">
                                                <div>
                                                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#78746D] mb-1 uppercase tracking-wider">
                                                        <Calendar size={11} className="text-[#A34828]" />
                                                        <time dateTime={blog.createdAt}>
                                                            {new Date(blog.createdAt || Date.now()).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </time>
                                                    </div>

                                                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors leading-snug mb-1">
                                                        <Link to={`/blog/${blog._id}`}>
                                                            {blog.title}
                                                        </Link>
                                                    </h3>

                                                    <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed line-clamp-2 mb-3">
                                                        {blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 130) : ''}...
                                                    </p>
                                                </div>

                                                <div className="pt-2 border-t border-[#1A1918]/10 flex items-center justify-between mt-auto">
                                                    <Link 
                                                        to={`/blog/${blog._id}`} 
                                                        className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#1A1918] group-hover:text-[#A34828] transition-colors inline-flex items-center gap-1.5 min-h-[38px]"
                                                    >
                                                        <span>Yazıyı Oku</span>
                                                        <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform text-[#A34828]" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>

                                        {/* In-feed Editorial Advertising Callout Banner */}
                                        {index === 1 && (
                                            <div className="col-span-1 md:col-span-2 border border-[#1A1918]/15 bg-[#F4F0E8] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 my-2">
                                                <div className="space-y-1 text-center sm:text-left">
                                                    <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-[0.2em] flex items-center gap-1 justify-center sm:justify-start">
                                                        <Megaphone size={12} />
                                                        REKLAM & İŞ BİRLİĞİ
                                                    </span>
                                                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1A1918]">
                                                        Reklam Vermek İster Misiniz?
                                                    </h3>
                                                    <p className="font-sans text-xs text-[#4A4744] font-light max-w-lg">
                                                        Markanızı, konaklama tesisinizi veya seyahat ürünlerinizi binlerce tutkulu gezginle buluşturun.
                                                    </p>
                                                </div>

                                                <Link
                                                    to="/contact"
                                                    className="shrink-0 bg-[#1A1918] hover:bg-[#A34828] text-[#FBF9F5] font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 transition-colors inline-flex items-center gap-1.5 min-h-[38px]"
                                                >
                                                    <span>Reklam Ver / İletişim</span>
                                                    <ArrowRight size={12} />
                                                </Link>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex flex-col items-center mt-8 mb-2 space-y-2 pt-6 border-t border-[#1A1918]/15">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="w-8 h-8 flex items-center justify-center border border-[#1A1918]/20 bg-[#FBF9F5] text-[#1A1918] hover:bg-[#1A1918] hover:text-[#FBF9F5] disabled:opacity-30 transition-colors font-mono text-xs cursor-pointer"
                                    >
                                        ←
                                    </button>

                                    <div className="flex items-center gap-1 font-mono text-xs">
                                        {[...Array(pagination.totalPages)].map((_, idx) => {
                                            const pageNum = idx + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-8 h-8 flex items-center justify-center border transition-colors cursor-pointer ${
                                                        pagination.currentPage === pageNum
                                                            ? 'bg-[#1A1918] text-[#FBF9F5] border-[#1A1918]'
                                                            : 'bg-[#FBF9F5] text-[#1A1918] border-[#1A1918]/20 hover:border-[#A34828] hover:text-[#A34828]'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="w-8 h-8 flex items-center justify-center border border-[#1A1918]/20 bg-[#FBF9F5] text-[#1A1918] hover:bg-[#1A1918] hover:text-[#FBF9F5] disabled:opacity-30 transition-colors font-mono text-xs cursor-pointer"
                                    >
                                        →
                                    </button>
                                </div>

                                <div className="font-mono text-[9px] uppercase text-[#78746D] tracking-widest">
                                    SAYFA {pagination.currentPage} / {pagination.totalPages}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Compact Sidebar */}
                    <aside className="w-full lg:w-1/4 space-y-5">
                        
                        {/* Compact Instagram Card */}
                        <a
                            href={settings?.instagramPostUrl || 'https://www.instagram.com/ceylan.m.e/'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3.5 border border-[#1A1918]/15 bg-[#F4F0E8] space-y-2.5 hover:border-[#A34828] transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center justify-between border-b border-[#1A1918]/15 pb-2">
                                <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest flex items-center gap-1">
                                    <Instagram size={12} />
                                    INSTAGRAM
                                </span>
                                <span className="font-mono text-[9px] font-bold text-[#1A1918]">
                                    {settings?.instagramFollowerCount || "104 Bin Takipçi"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#A34828] shrink-0 bg-[#1A1918]">
                                    <img
                                        src={instagramAvatar}
                                        alt="Ceylan.m.e Instagram"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = '/youtube-avatar.jpg'; }}
                                    />
                                </div>
                                <div className="min-w-0 flex-1 font-mono text-xs">
                                    <span className="block font-bold text-[#1A1918] truncate">@ceylan.m.e</span>
                                    <span className="text-[9px] text-[#78746D] block">Seyahat & Fotoğraf</span>
                                </div>
                            </div>

                            <div className="w-full py-1.5 bg-[#1A1918] group-hover:bg-[#A34828] text-[#FBF9F5] font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-colors min-h-[34px] flex items-center justify-center">
                                Takip Et ↗
                            </div>
                        </a>

                        {/* YouTube Card */}
                        <a
                            href={settings?.youtubeUrl || 'https://www.youtube.com/@Ceylan.m.e'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3.5 border border-[#1A1918]/15 bg-[#F4F0E8] space-y-2.5 hover:border-[#A34828] transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center justify-between border-b border-[#1A1918]/15 pb-2">
                                <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest flex items-center gap-1">
                                    <Youtube size={12} />
                                    YOUTUBE
                                </span>
                            </div>

                            <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed">
                                Sinematik seyahat günlükleri ve gezinti rehberleri.
                            </p>

                            <div className="w-full py-1.5 border border-[#1A1918] text-[#1A1918] group-hover:bg-[#1A1918] group-hover:text-[#FBF9F5] font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-colors min-h-[34px] flex items-center justify-center">
                                Abone Ol ↗
                            </div>
                        </a>

                        {/* Compact Advertising / Sponsorship Card */}
                        <div className="p-3.5 border border-[#1A1918]/15 bg-[#FBF9F5] space-y-1.5">
                            <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest block">
                                SPONSORLUK
                            </span>
                            <h3 className="font-serif text-base font-normal text-[#1A1918]">
                                Reklam Vermek İster Misiniz?
                            </h3>
                            <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed">
                                Markanızı veya seyahat ürünlerinizi okurlarımızla buluşturun.
                            </p>
                            <Link 
                                to="/contact" 
                                className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-widest hover:underline pt-1 min-h-[32px]"
                            >
                                <span>Reklam İletişimi</span>
                                <span>→</span>
                            </Link>
                        </div>

                    </aside>

                </div>
            </div>

            {/* 3D Map Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-[#1A1918]/15 pt-8">
                <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#1A1918]/15">
                    <div>
                        <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest block mb-0.5">
                            ROTA HARİTASI
                        </span>
                        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1918]">
                            Keşif Haritası
                        </h2>
                    </div>
                </div>

                <div className="relative border border-[#1A1918]/15 bg-[#F4F0E8] overflow-hidden h-[280px] sm:h-[320px]">
                    <React.Suspense fallback={<div className="h-full flex items-center justify-center font-mono text-xs uppercase text-[#A34828]">Harita Yükleniyor...</div>}>
                        <WorldMap settings={settings} />
                    </React.Suspense>
                </div>
            </div>

            {/* Contact Invitation Section */}
            <section className="py-8 sm:py-10 bg-[#F4F0E8] border-t border-[#1A1918]/15 text-center relative overflow-hidden">
                <div className="max-w-md mx-auto px-4 space-y-2">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-[#A34828] uppercase block">
                        ROTA SORULARIN İÇİN
                    </span>

                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1918] font-normal tracking-tight">
                        İletişime Geçin
                    </h2>

                    <p className="font-serif italic text-xs sm:text-sm text-[#4A4744] font-light leading-relaxed">
                        “Seyahat tavsiyeleri veya ortaklık teklifleriniz için doğrudan ulaşabilirsiniz.”
                    </p>

                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Link
                            to="/contact"
                            className="bg-[#1A1918] text-[#FBF9F5] hover:bg-[#A34828] font-mono text-[10px] font-bold uppercase tracking-widest px-5 py-2 transition-colors inline-flex items-center gap-1 min-h-[36px]"
                        >
                            <span>Mesaj Gönder</span>
                            <span>→</span>
                        </Link>

                        <a
                            href={settings?.instagramPostUrl || "https://www.instagram.com/ceylan.m.e/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-[#1A1918] text-[#1A1918] hover:bg-[#1A1918] hover:text-[#FBF9F5] font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors inline-flex items-center gap-1 min-h-[36px]"
                        >
                            <span>Instagram</span>
                            <span>↗</span>
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
