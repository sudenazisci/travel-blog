
import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Avrupa için ana ve yedek görsel adresleri
const EUROPE_IMAGE =
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1600&q=85';

const EUROPE_FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85';

const DestinationPage = () => {
    const { id } = useParams();

    const [destination, setDestination] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);

            try {
                const allDestResponse = await axios.get(
                    `${API_BASE}/api/destinations`
                );

                if (!Array.isArray(allDestResponse.data)) {
                    throw new Error('Destinasyon verileri beklenen formatta değil.');
                }

                const allDestinations = allDestResponse.data;

                const currentDestination = allDestinations.find(
                    (item) => item && String(item._id) === String(id)
                );

                if (!isMounted) return;

                setDestination(currentDestination || null);

                if (!currentDestination) {
                    setBlogs([]);
                    return;
                }

                const blogsResponse = await axios.get(
                    `${API_BASE}/api/blogs`
                );

                const allBlogs = Array.isArray(blogsResponse.data)
                    ? blogsResponse.data
                    : blogsResponse.data?.blogs || [];

                const childrenIds = allDestinations
                    .filter((item) => {
                        if (!item || !item.parent) return false;

                        const parentId =
                            typeof item.parent === 'object'
                                ? item.parent._id
                                : item.parent;

                        return String(parentId) === String(id);
                    })
                    .map((item) => String(item._id));

                const filteredBlogs = allBlogs.filter((blog) => {
                    if (!blog || blog.isDraft) return false;

                    const blogDestinationId = blog.destination
                        ? typeof blog.destination === 'object'
                            ? blog.destination._id
                            : blog.destination
                        : null;

                    if (!blogDestinationId) return false;

                    return (
                        String(blogDestinationId) === String(id) ||
                        childrenIds.includes(String(blogDestinationId))
                    );
                });

                if (isMounted) {
                    setBlogs(filteredBlogs);
                }
            } catch (error) {
                console.error('Destinasyon yüklenirken hata oluştu:', error);

                if (isMounted) {
                    setDestination(null);
                    setBlogs([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FBF9F5] font-mono text-xs text-[#A34828] uppercase tracking-widest">
                Destinasyon Yükleniyor...
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FBF9F5] font-mono text-xs text-[#1A1918] uppercase tracking-widest">
                Destinasyon bulunamadı
            </div>
        );
    }

    const isEurope =
        destination.name?.trim().toLocaleUpperCase('tr-TR') === 'AVRUPA';

    const heroImage = isEurope
        ? EUROPE_IMAGE
        : destination.image;

    const handleHeroImageError = (event) => {
        const imageElement = event.currentTarget;

        // Aynı görsel için sonsuz hata döngüsünü önle
        if (imageElement.dataset.fallbackApplied === 'true') {
            imageElement.style.display = 'none';
            return;
        }

        imageElement.dataset.fallbackApplied = 'true';

        if (isEurope) {
            imageElement.src = EUROPE_FALLBACK_IMAGE;
        } else {
            imageElement.style.display = 'none';
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] flex flex-col justify-between selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <Navbar />

            <main className="flex-grow">
                {/* Hero / Bölgenin büyük arka plan görseli */}
                <div className="relative h-[65vh] min-h-[380px] bg-[#1A1918] flex items-center justify-center overflow-hidden">
                    {heroImage && (
                        <img
                            key={`${destination._id}-${heroImage}`}
                            src={heroImage}
                            alt={destination.name}
                            onError={handleHeroImageError}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-transparent to-transparent pointer-events-none" />

                    <div className="relative z-10 text-center text-white px-4 max-w-4xl space-y-4">
                        <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#A34828] bg-[#FBF9F5] px-3.5 py-1 inline-block">
                            SEYAHAT REHBERİ
                        </span>

                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal text-white tracking-tight">
                            {destination.name}
                        </h1>

                        <p className="text-lg sm:text-xl font-light text-[#FBF9F5]/80 max-w-2xl mx-auto font-sans">
                            {destination.description}
                        </p>
                    </div>
                </div>

                {/* Bölgeye ait yazılar */}
                <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-20">
                    <div className="flex items-end justify-between mb-12 border-b border-[#1A1918]/15 pb-6">
                        <div>
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#A34828] block mb-1">
                                ROTA YAZILARI
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#1A1918]">
                                {destination.name} İçerikleri
                            </h2>
                        </div>

                        <div className="font-mono text-xs text-[#78746D]">
                            {blogs.length} Yazı Kayıtlı
                        </div>
                    </div>

                    {blogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    to={`/blog/${blog._id}`}
                                    className="group border border-[#1A1918]/15 bg-[#F4F0E8] flex flex-col justify-between p-5 space-y-4"
                                >
                                    <div className="aspect-[16/10] bg-[#1A1918] overflow-hidden">
                                        {blog.image && (
                                            <img
                                                src={blog.image}
                                                alt={blog.title || 'Seyahat yazısı'}
                                                onError={(event) => {
                                                    event.currentTarget.style.display = 'none';
                                                }}
                                                className="w-full h-full object-cover img-editorial-zoom"
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-serif text-2xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors leading-tight">
                                            {blog.title}
                                        </h3>

                                        <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed line-clamp-3">
                                            {blog.content
                                                ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 140)
                                                : ''}
                                            ...
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[#1A1918]/10 font-mono text-xs font-bold uppercase tracking-widest text-[#1A1918] group-hover:text-[#A34828] flex items-center justify-between min-h-[44px]">
                                        <span>Devamını Oku</span>
                                        <span>→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-[#1A1918]/15 bg-[#F4F0E8] p-8">
                            <h3 className="font-serif text-2xl text-[#1A1918]">
                                Henüz bu destinasyona yazı eklenmemiş.
                            </h3>

                            <p className="font-mono text-xs text-[#78746D] mt-2">
                                Diğer rotaları keşfedebilir veya daha sonra tekrar göz atabilirsiniz.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DestinationPage;
