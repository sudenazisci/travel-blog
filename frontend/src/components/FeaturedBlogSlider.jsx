import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import API_BASE from '../api';

const FeaturedBlogSlider = ({ blogs = [], featuredBlogs = [] }) => {
    const items = (featuredBlogs && featuredBlogs.length > 0)
        ? featuredBlogs
        : (blogs && blogs.length > 0) ? blogs.slice(0, 5) : [];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        if (items.length <= 1 || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % items.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [items.length, isHovered]);

    if (!items || items.length === 0) return null;

    const currentSlide = items[currentIndex] || items[0];

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % items.length);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        if (Math.abs(distance) > 50) {
            if (distance > 0) nextSlide();
            else prevSlide();
        }
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const getImageUrl = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&auto=format&fit=crop&q=80';
        if (img.startsWith('http')) return img;
        return `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    const getExcerpt = (slide) => {
        if (slide.metaDescription) return slide.metaDescription;
        if (slide.subtitle) return slide.subtitle;
        if (slide.content) {
            const stripped = slide.content.replace(/<[^>]*>?/gm, '');
            return stripped.length > 120 ? `${stripped.substring(0, 120)}...` : stripped;
        }
        return 'Dünyanın dört bir yanından ilham verici seyahat hikayeleri ve özgün rotalar.';
    };

    const blogLink = currentSlide._id ? `/blog/${currentSlide._id}` : (currentSlide.link || '/destinations');

    return (
        <section 
            className="w-full mb-10 select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#1A1918]/15">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#A34828]">
                    ÖNE ÇIKAN SEYAHAT ROTALARI
                </span>
                <span className="font-mono text-[10px] text-[#78746D]">
                    0{currentIndex + 1} / 0{items.length}
                </span>
            </div>

            {/* Compact Slider Container */}
            <div className="relative w-full h-[360px] sm:h-[400px] lg:h-[440px] overflow-hidden bg-[#1A1918] group">
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide._id || currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute inset-0 z-10"
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-out transform group-hover:scale-105"
                            style={{
                                backgroundImage: `url('${getImageUrl(currentSlide.image)}')`,
                                backgroundPosition: `center ${currentSlide.imagePosition || '50%'}`
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-[#1A1918]/50 to-transparent"></div>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-10 pb-8 sm:pb-10 flex flex-col justify-end text-white">
                            
                            <motion.div 
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="space-y-2.5 max-w-2xl"
                            >
                                {/* Tag */}
                                {(currentSlide.destination || currentSlide.category) && (
                                    <span className="font-mono text-[10px] font-bold text-[#A34828] bg-[#FBF9F5] px-2.5 py-0.5 uppercase tracking-[0.2em] inline-block">
                                        {currentSlide.destination?.name || currentSlide.category || 'Öne Çıkan'}
                                    </span>
                                )}

                                {/* Headline */}
                                <h1 className="font-serif text-2xl sm:text-4xl lg:text-4xl font-normal leading-tight text-white tracking-tight">
                                    <Link to={blogLink} className="hover:text-[#F4F0E8] transition-colors">
                                        {currentSlide.title}
                                    </Link>
                                </h1>

                                {/* Excerpt */}
                                <p className="font-sans text-xs sm:text-sm text-[#FBF9F5]/80 font-light leading-relaxed line-clamp-2">
                                    {getExcerpt(currentSlide)}
                                </p>

                                {/* Action Button */}
                                <div className="pt-1">
                                    <Link
                                        to={blogLink}
                                        className="inline-flex items-center gap-2 bg-[#FBF9F5] text-[#1A1918] px-5 py-2 font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-[#A34828] hover:text-white transition-all duration-300 group/btn"
                                    >
                                        <span>Hikayeyi Oku</span>
                                        <ArrowRight size={12} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                            </motion.div>

                        </div>

                    </motion.div>
                </AnimatePresence>

                {/* Arrow Buttons */}
                {items.length > 1 && (
                    <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-30 flex items-center gap-1.5">
                        <button
                            onClick={prevSlide}
                            aria-label="Önceki slide"
                            className="w-9 h-9 bg-[#FBF9F5]/90 hover:bg-[#FBF9F5] text-[#1A1918] hover:text-[#A34828] flex items-center justify-center transition-colors border border-[#1A1918]/15"
                        >
                            <ArrowLeft size={14} />
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="Sonraki slide"
                            className="w-9 h-9 bg-[#FBF9F5]/90 hover:bg-[#FBF9F5] text-[#1A1918] hover:text-[#A34828] flex items-center justify-center transition-colors border border-[#1A1918]/15"
                        >
                            <ArrowRight size={14} />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default FeaturedBlogSlider;
