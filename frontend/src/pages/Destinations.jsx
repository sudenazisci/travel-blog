import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, MapPin } from 'lucide-react';

const DEFAULT_DESTINATIONS = [
    {
        _id: 'kapadokya',
        name: 'Kapadokya',
        description: 'Peri bacaları, sıcak hava balonları ve büyülü vadilerde gün doğumu.',
        image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=1600&auto=format&fit=crop'
    },
    {
        _id: 'istanbul',
        name: 'İstanbul',
        description: 'İki kıtanın birleştiği kadim sokaklar, Boğaz esintisi ve tarihi yarımada.',
        image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1600&auto=format&fit=crop'
    },
    {
        _id: 'tokyo',
        name: 'Tokyo',
        description: 'Neon ışıklarıyla parlayan caddeler, tapınaklar ve fütüristik metropol.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1600&auto=format&fit=crop'
    },
    {
        _id: 'busan',
        name: 'Busan',
        description: 'Güney Kore’nin sahil cenneti, renkli Gamcheon köyü ve tapınaklar.',
        image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1600&auto=format&fit=crop'
    }
];

const trNormalize = (text) => {
    if (!text) return '';
    return String(text)
        .replace(/İ/g, 'i')
        .replace(/I/g, 'ı')
        .replace(/Ğ/g, 'g')
        .replace(/ğ/g, 'g')
        .replace(/Ü/g, 'u')
        .replace(/ü/g, 'u')
        .replace(/Ş/g, 's')
        .replace(/ş/g, 's')
        .replace(/Ö/g, 'o')
        .replace(/ö/g, 'o')
        .replace(/Ç/g, 'c')
        .replace(/ç/g, 'c')
        .toLowerCase()
        .trim();
};

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [destRes, blogsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/destinations`),
                    axios.get(`${API_BASE}/api/blogs?limit=100`)
                ]);
                const subDests = (destRes.data || []).filter(d => d && !d.isRegion);
                const listToUse = subDests.length > 0 ? subDests : destRes.data;
                setDestinations(listToUse.length > 0 ? listToUse : DEFAULT_DESTINATIONS);
                setBlogs(blogsRes.data.blogs || blogsRes.data || []);
            } catch (error) {
                setDestinations(DEFAULT_DESTINATIONS);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Case and diacritic insensitive Turkish search filter
    const normalizedQuery = trNormalize(searchQuery);
    
    const filteredDestinations = destinations.filter(dest => {
        if (!dest) return false;
        if (!normalizedQuery) return true;
        const normName = trNormalize(dest.name);
        const normDesc = trNormalize(dest.description);
        return normName.includes(normalizedQuery) || normDesc.includes(normalizedQuery);
    });

    const filteredBlogs = blogs.filter(blog => {
        if (!blog) return false;
        if (!normalizedQuery) return false;
        const normTitle = trNormalize(blog.title);
        const normContent = trNormalize(blog.content);
        const destName = (blog.destination && typeof blog.destination === 'object')
            ? blog.destination.name 
            : (blog.destination || '');
        const normDest = trNormalize(destName);

        return normTitle.includes(normalizedQuery) || normDest.includes(normalizedQuery) || normContent.includes(normalizedQuery);
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-[#A34828]">
                Rotalar Yükleniyor...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] flex flex-col justify-between selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <SEO 
                title="Rotalar & Şehir Rehberleri — Ceylan.m.e"
                description="Dünyanın dört bir yanından özenle seçilmiş seyahat rotaları ve şehir rehberleri."
            />
            
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-24 w-full">
                
                {/* Header */}
                <div className="pb-6 mb-8 border-b border-[#1A1918]/15 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.2em] block mb-2">
                            DÜNYA SEYAHAT REHBERİ
                        </span>
                        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A1918]">
                            Keşfedilen Rotalar
                        </h1>
                    </div>

                    <div className="font-mono text-xs text-[#78746D]">
                        {filteredDestinations.length} Rota Kayıtlı
                    </div>
                </div>

                {/* Interactive Turkish Search Bar */}
                <div className="mb-12 max-w-2xl">
                    <div className="relative flex items-center border border-[#1A1918]/20 bg-[#F4F0E8] focus-within:border-[#A34828] transition-colors p-1">
                        <Search size={18} className="text-[#1A1918]/40 ml-3.5 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Şehir veya ülke adı girin (Örn: İstanbul, Kapadokya, Tokyo, İtalya)..."
                            className="w-full bg-transparent px-3 py-2.5 font-sans text-sm text-[#1A1918] placeholder-[#1A1918]/40 outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-3 text-xs font-mono font-bold text-[#78746D] hover:text-[#A34828] uppercase shrink-0 cursor-pointer"
                            >
                                Temizle ×
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="font-mono text-[10px] text-[#A34828] uppercase tracking-wider mt-2">
                            "{searchQuery}" için {filteredDestinations.length} rota, {filteredBlogs.length} seyahat yazısı bulundu.
                        </p>
                    )}
                </div>

                {/* Search Result: Matching Blog Articles */}
                {searchQuery && filteredBlogs.length > 0 && (
                    <div className="mb-14 pb-10 border-b border-[#1A1918]/15">
                        <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.2em] block mb-4">
                            İLGİLİ SEYAHAT YAZILARI ({filteredBlogs.length})
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBlogs.map(blog => (
                                <Link 
                                    key={blog._id} 
                                    to={`/blog/${blog._id}`} 
                                    className="group border border-[#1A1918]/15 bg-[#F4F0E8] p-4 flex flex-col justify-between space-y-3"
                                >
                                    <div className="aspect-[16/10] bg-[#1A1918] overflow-hidden">
                                        <img
                                            src={blog.image ? (blog.image.startsWith('http') ? blog.image : `${API_BASE}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`) : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover img-editorial-zoom"
                                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'; }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest">
                                            {blog.destination?.name || 'Seyahat'}
                                        </div>
                                        <h3 className="font-serif text-xl text-[#1A1918] group-hover:text-[#A34828] transition-colors leading-tight">
                                            {blog.title}
                                        </h3>
                                    </div>
                                    <div className="pt-2 border-t border-[#1A1918]/10 font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1918] flex items-center justify-between">
                                        <span>Yazıyı Oku</span>
                                        <span>→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Destinations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredDestinations.map((dest) => (
                        <div key={dest._id} className="group border border-[#1A1918]/15 bg-[#F4F0E8] flex flex-col justify-between p-5 space-y-4">
                            <div className="aspect-[4/3] bg-[#1A1918] overflow-hidden">
                                <img 
                                    src={dest.image} 
                                    alt={dest.name} 
                                    className="w-full h-full object-cover img-editorial-zoom"
                                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800'; }}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-1 font-mono text-[10px] text-[#A34828] uppercase tracking-widest">
                                    <MapPin size={12} />
                                    <span>Destinasyon</span>
                                </div>
                                <h3 className="font-serif text-2xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors">
                                    {dest.name}
                                </h3>
                                <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed line-clamp-2">
                                    {dest.description || `${dest.name} gezi ve rota rehberi.`}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-[#1A1918]/10">
                                <Link 
                                    to={`/destination/${dest._id}`} 
                                    className="font-mono text-xs font-bold uppercase tracking-widest text-[#1A1918] hover:text-[#A34828] transition-colors flex items-center justify-between min-h-[44px]"
                                >
                                    <span>Rotayı İncele</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}

                    {filteredDestinations.length === 0 && (
                        <div className="col-span-full py-12 text-center border border-[#1A1918]/15 bg-[#F4F0E8] p-6">
                            <p className="font-serif text-xl text-[#1A1918]">"{searchQuery}" aramasıyla eşleşen bir rota bulunamadı.</p>
                            <p className="font-mono text-xs text-[#78746D] mt-1">Farklı bir şehir veya ülke ismi arayabilirsiniz.</p>
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Destinations;
