import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import CountUp from '../components/CountUp';
import TextType from '../components/TextType';
import SEO from '../components/SEO';

const WorldMap = React.lazy(() => import('../components/WorldMap'));


const Home = () => {

    const [blogs, setBlogs] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalBlogs: 0
    });
    const [ads, setAds] = useState([]);
    const [settings, setSettings] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        const slideCount = settings?.heroSlides?.length || settings?.featuredBlogs?.length || 0;
        if (slideCount === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideCount);
        }, 5000);
        return () => clearInterval(interval);
    }, [settings?.featuredBlogs, settings?.heroSlides]);

    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('search') || '';
    const pageQuery = parseInt(new URLSearchParams(location.search).get('page')) || 1;

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/?search=${searchInput}&page=1`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            const params = new URLSearchParams(location.search);
            params.set('page', newPage);
            navigate(`/?${params.toString()}`);
            
            // Scroll to the blog section specifically
            const blogSection = document.getElementById('blog-section');
            if (blogSection) {
                blogSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    // Fix useEffect to listen to URL changes
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search') || '';
        const page = parseInt(params.get('page')) || 1;
        const limit = 4; // 4 items per page as requested

        // Fetch Blogs
        const fetchBlogs = async () => {
            try {
                let url = `${API_BASE}/api/blogs?page=${page}&limit=${limit}`;
                if (query) url += `&search=${query}`;

                const res = await axios.get(url);

                // Handle both paginated and non-paginated responses for safety
                if (res.data.blogs) {
                    setBlogs(res.data.blogs);
                    setPagination({
                        currentPage: res.data.currentPage,
                        totalPages: res.data.totalPages,
                        totalBlogs: res.data.totalBlogs
                    });
                } else {
                    // Fallback if backend returns array
                    setBlogs(res.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchBlogs();
    }, [location.search]); // Depend on URL search params

    // Fetch Ads & Settings only once
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/ads`);
                setAds(res.data);
            } catch (error) { console.error(error); }
        }
        fetchAds();

        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/settings`);
                setSettings(res.data);
            } catch (error) { console.error(error); }
        }
        fetchSettings();
    }, []);

    // Defaults
    const heroTitle = settings?.heroTitle || "Discover Your Next Great Adventure";
    const heroSubtitle = settings?.heroSubtitle || "Curated travel guides, hidden gems, and inspiring stories from explorers around the globe.";
    const heroImage = settings?.heroImage || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title={settings?.siteTitle || "Ana Sayfa"}
                description={settings?.heroSubtitle || "Seyahat rehberi ve blogu"}
            />
            <Navbar />

            {/* Hero Section - Dynamic Slider */}
            {/* Logic: Use heroSlides if available, otherwise fallback to featuredBlogs mapped to slide format */}
            {!settings ? (
                <div className="relative h-[60vh] md:h-[600px] mb-8 md:mb-12 bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="text-gray-300">Yükleniyor...</div>
                </div>
            ) : (settings?.heroSlides?.length > 0 || settings?.featuredBlogs?.length > 0) ? (
                <div className="relative h-[60vh] md:h-[600px] overflow-hidden mb-8 md:mb-12 group">
                    {(() => {
                        // Prepare slides array
                        const slides = (settings?.heroSlides?.length > 0)
                            ? settings.heroSlides
                            : settings.featuredBlogs.map(b => ({
                                _id: b._id,
                                image: b.image,
                                title: b.title,
                                subtitle: b.metaDescription,
                                link: `/blog/${b._id}`,
                                destination: b.destination, // Optional extra for blog fallback
                                textColor: '#ffffff',
                                imagePosition: '50%'
                            }));

                        // Handle slide cycle if count changes (safety)
                        const activeSlide = slides[currentSlide] ? currentSlide : 0;

                        return slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover transition-transform duration-[10s] ease-linear transform hover:scale-105"
                                    style={{
                                        backgroundImage: `url('${slide.image?.startsWith('http') ? slide.image : `${API_BASE}${slide.image.startsWith('/') ? '' : '/'}${slide.image}`}')`,
                                        backgroundPosition: `center ${slide.imagePosition || '50%'}`
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
                                </div>

                                {/* Content */}
                                <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
                                    <div className="max-w-4xl mx-auto flex flex-col items-center animate-fadeInUp text-white drop-shadow-lg">
                                        {/* Location Tag (Only shows if strictly mapped from blog with destination) */}
                                        {slide.destination && (
                                            <span
                                                className="block font-bold tracking-[0.2em] mb-4 uppercase text-sm md:text-base bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full border border-white/40"
                                            >
                                                {slide.destination.parent && `${slide.destination.parent.name} • `}
                                                {slide.destination.name}
                                            </span>
                                        )}

                                        {/* Title */}
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                            <Link to={slide.link || '#'} className="hover:text-amber-200 transition-colors">
                                                {slide.title}
                                            </Link>
                                        </h1>

                                        {/* Subtitle */}
                                        <p
                                            className="text-lg md:text-xl mb-8 font-medium max-w-2xl mx-auto line-clamp-2 hidden md:block text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                                        >
                                            {slide.subtitle || "Dünyayı keşfetmek için harika bir rehber."}
                                        </p>

                                        {/* Button */}
                                        <Link
                                            to={slide.link || '#'}
                                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-xl"
                                        >
                                            Devamını Oku
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ));
                    })()}

                    {/* Navigation Buttons (Only if > 1 slide) */}
                    {((settings.heroSlides?.length || 0) + (settings.featuredBlogs?.length || 0) > 1) && (
                        <>
                            <button
                                onClick={() => {
                                    const count = settings.heroSlides?.length > 0 ? settings.heroSlides.length : settings.featuredBlogs.length;
                                    setCurrentSlide(prev => prev === 0 ? count - 1 : prev - 1);
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all border border-white/20 hidden md:flex"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => {
                                    const count = settings.heroSlides?.length > 0 ? settings.heroSlides.length : settings.featuredBlogs.length;
                                    setCurrentSlide(prev => (prev + 1) % count);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all border border-white/20 hidden md:flex"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                                {(settings.heroSlides?.length > 0 ? settings.heroSlides : settings.featuredBlogs).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                /* Static Hero Fallback */
                <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 h-[60vh] md:h-[600px] flex items-center justify-center text-center px-4 overflow-hidden mb-8 md:mb-12">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
                        style={{ backgroundImage: `url('${heroImage}')` }}
                    ></div>
                    <div className="relative z-10 max-w-4xl mx-auto text-white flex flex-col items-center">

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="w-full max-w-xs md:max-w-sm mb-16 relative group">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ülke veya şehir ara..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full py-3 pl-5 pr-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-gray-100 focus:outline-none focus:bg-white/20 focus:border-white/50 transition-all shadow-lg text-sm font-medium tracking-wide"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors text-white"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        <span className="block text-accent font-medium tracking-wider mb-4 uppercase text-sm md:text-base animate-fadeIn">Keşfedilmemişi Keşfet</span>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
                            {heroTitle}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 mb-8 font-light max-w-2xl mx-auto drop-shadow-md">
                            {heroSubtitle}
                        </p>
                    </div>
                </div>
            )}


            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-4 md:mt-8">
                {/* Inline Style for Marquee to ensure it works immediately */}
                <style>{`
                    @keyframes scrollText {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100%); }
                    }
                    .animate-scroll {
                        animation: scrollText 80s linear infinite; // Slower speed (80s)
                    }
                `}</style>

                {/* Announcement Marquee (Visible Always) */}
                <div className="mb-10 overflow-hidden bg-white border-y border-gray-200 py-4 relative flex">
                    <div className="animate-scroll whitespace-nowrap flex items-center font-medium text-gray-900 tracking-widest text-sm uppercase">
                        {/* Repeater */}
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-12">
                                {settings?.announcement || "VIETNAM VE TAYLAND SEYAHAT REHBERİ ÇOK YAKINDA!"}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 lg:items-start">
                    {/* Main Content */}
                    <main className="w-full lg:w-3/4">

                        <div id="blog-section" className="flex items-center justify-between mb-8 scroll-mt-24">
                            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-amber-500 pl-4">
                                {searchQuery ? `"${searchQuery}" Sonuçları` : "Son Yazılar"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {blogs.map(blog => (
                                <article key={blog._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1">
                                    <div className="relative overflow-hidden h-56">
                                        <img
                                            src={blog.image ? (blog.image.startsWith('http') ? blog.image : `${API_BASE}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`) : 'https://via.placeholder.com/400x300'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            style={{ objectPosition: `center ${blog.imagePosition || '50%'}` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">Seyahat</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                                                <Calendar size={12} className="text-gray-300" />
                                                {new Date(blog.createdAt || Date.now()).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <div className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <Link to={`/blog/${blog._id}`} className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 flex items-center gap-1 group/link">
                                                Devamını Oku
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Refined Premium Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex flex-col items-center mt-16 space-y-4">
                                <div className="flex items-center gap-1.5">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all duration-300 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <div className="flex items-center bg-white border border-gray-100 p-1 rounded-2xl shadow-sm">
                                        {[...Array(pagination.totalPages)].map((_, idx) => {
                                            const pageNum = idx + 1;
                                            // Smart Pagination: Show current, first, last and dots
                                            if (
                                                pageNum === 1 || 
                                                pageNum === pagination.totalPages || 
                                                (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`min-w-[32px] md:min-w-[40px] h-8 md:h-10 px-2 md:px-3 rounded-lg md:rounded-xl text-sm md:text-base font-bold transition-all duration-500 flex items-center justify-center ${
                                                            pagination.currentPage === pageNum
                                                            ? 'bg-amber-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)]'
                                                            : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                pageNum === pagination.currentPage - 2 || 
                                                pageNum === pagination.currentPage + 2
                                            ) {
                                                return <span key={pageNum} className="w-8 flex justify-center text-gray-300 font-bold select-none">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all duration-300 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="text-[8px] md:text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                                    Sayfa {pagination.currentPage} / {pagination.totalPages}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4 grid grid-cols-2 lg:flex lg:flex-col gap-3 lg:gap-8 mb-8 lg:mb-0">
                        {/* Instagram Promo */}
                        {/* Instagram Promo - Modern Redesign */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative group hover:shadow-xl transition-all duration-500 w-full lg:max-w-[220px] mx-auto flex flex-col">
                            {/* Gradient Header Line */}
                            <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"></div>

                            <div className="p-1.5 md:p-2 lg:p-2.5 flex flex-col">
                                <div className="flex items-center justify-between mb-1.5 lg:mb-2">
                                    <h3 className="text-[10px] md:text-xs font-bold text-gray-800 flex items-center gap-1">
                                        <div className="p-1 bg-pink-50 text-pink-600 rounded-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                                        </div>
                                        Instagram
                                    </h3>
                                    <a href={settings?.instagramPostUrl || '#'} target="_blank" className="text-gray-400 hover:text-pink-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></svg>
                                    </a>
                                </div>

                                {/* Stats Grid - Hidden on mobile to save vertical space */}
                                <div className="hidden lg:grid grid-cols-3 gap-1 mb-1.5 border-b border-gray-100 pb-1.5">
                                    <div className="text-center group-hover:transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="block font-black text-xs text-gray-900">
                                            <CountUp
                                                to={parseInt(settings?.instagramPostCount || '443') || 443}
                                                duration={2}
                                                separator=","
                                                className="count-up-text"
                                            />
                                        </span>
                                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold">Gönderi</span>
                                    </div>
                                    <div className="text-center group-hover:transform group-hover:scale-110 transition-transform duration-300 delay-75">
                                        <span className="block font-black text-xs text-gray-900">
                                            <CountUp
                                                to={102}
                                                duration={2}
                                                separator=","
                                                className="count-up-text"
                                            /> B
                                        </span>
                                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold">Takipçi</span>
                                    </div>
                                    <div className="text-center group-hover:transform group-hover:scale-110 transition-transform duration-300 delay-100">
                                        <span className="block font-black text-xs text-gray-900">
                                            <CountUp
                                                to={parseInt(settings?.instagramFollowingCount || '405') || 405}
                                                duration={2}
                                                separator=","
                                                className="count-up-text"
                                            />
                                        </span>
                                        <span className="text-[8px] uppercase tracking-wider text-gray-400 font-semibold">Takip</span>
                                    </div>
                                </div>

                                {/* Preview Image Container */}
                                <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto rounded-md md:rounded-lg overflow-hidden mb-1.5 lg:mb-2 shadow-sm md:shadow-md cursor-pointer flex-shrink-0">
                                    <a href={settings?.instagramPostUrl || '#'} target="_blank">
                                        <img
                                            src={settings?.instagramPreviewImage || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&auto=format&fit=crop&q=60'}
                                            alt="Instagram Post"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                        <div className="absolute bottom-2 left-2 right-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <p className="text-white text-[9px] font-medium truncate drop-shadow-md">
                                                View latest updates & stories
                                            </p>
                                        </div>
                                    </a>
                                </div>

                                {/* CTA Button */}
                                <a
                                    href={settings?.instagramPostUrl || '#'}
                                    target="_blank"
                                    className="block w-full py-1 lg:py-1.5 rounded md:rounded-md bg-gray-900 text-white font-bold text-[9px] md:text-[10px] text-center shadow hover:shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-0.5 mt-auto"
                                >
                                    Takip Et
                                </a>
                            </div>
                        </div>

                        {/* YouTube Widget - Compact & Stylish */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden relative group hover:shadow-lg transition-all duration-500 w-full lg:max-w-[220px] mx-auto flex flex-col">
                            <div className="h-1 w-full bg-[#FF0000] flex-shrink-0"></div>
                            <div className="p-1.5 lg:p-4 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-1 lg:gap-0 flex-1">
                                <div className="flex flex-col lg:flex-row items-center gap-0.5 lg:gap-3 text-center lg:text-left mb-1 lg:mb-0">
                                    <div className="relative w-7 h-7 min-w-[28px] min-h-[28px] md:w-10 md:h-10 md:min-w-[40px] md:min-h-[40px] rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                                        <img
                                            src={'/youtube-avatar.jpg'}
                                            alt="YouTube"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold text-gray-900">YouTube</p>
                                        <p className="hidden lg:block text-[9px] text-gray-500 font-medium leading-tight max-w-[120px]">Daha fazla içerik için abone olabilirsiniz.</p>
                                    </div>
                                </div>
                                <a
                                    href={settings?.youtubeUrl || 'https://www.youtube.com/@Ceylan.m.e'}
                                    target="_blank"
                                    className="w-full lg:w-auto text-center px-1.5 py-1 lg:py-1 bg-[#FF0000] text-white text-[9px] font-bold uppercase tracking-wider rounded md:rounded-md shadow-sm hover:bg-red-700 transition-colors transform group-hover:scale-105 mt-auto lg:mt-0"
                                >
                                    Abone Ol
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* 3D Globe Section */}
            {/* 3D Globe Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-accent pl-4">Dünyamızı Keşfedin</h2>
                <div className="relative">
                    <React.Suspense fallback={<div className="h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">Harita Yükleniyor...</div>}>
                        <WorldMap settings={settings} />
                    </React.Suspense>
                </div>
            </div >

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default Home;
