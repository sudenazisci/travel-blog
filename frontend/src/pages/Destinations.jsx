import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Calendar } from 'lucide-react';

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
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/blogs?limit=100`);
                const fetched = res.data.blogs || res.data || [];
                setBlogs(Array.isArray(fetched) ? fetched : []);
            } catch (error) {
                console.error("Error fetching blogs for destinations page:", error);
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const normalizedQuery = trNormalize(searchQuery);

    const filteredBlogs = blogs.filter(blog => {
        if (!blog) return false;
        if (!normalizedQuery) return true;
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
            <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] flex items-center justify-center font-sans text-xs uppercase tracking-widest text-[#A34828]">
                Rotalar Yükleniyor...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] flex flex-col justify-between selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <SEO 
                title="Keşfedilen Rotalar — Ceylan.m.e"
                description="Dünyanın dört bir yanından özenle seçilmiş seyahat rotaları ve rehberler."
            />
            
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 pb-24 w-full flex-grow">
                
                {/* Header */}
                <div className="pb-6 mb-8 border-b border-[#1A1918]/15 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-sans text-[10px] font-bold text-[#A34828] uppercase tracking-[0.2em] block mb-2">
                            DÜNYA SEYAHAT REHBERİ
                        </span>
                        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A1918]">
                            Keşfedilen Rotalar
                        </h1>
                    </div>

                    <div className="font-sans text-xs text-[#78746D]">
                        {filteredBlogs.length} Rota Kayıtlı
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
                            placeholder="Rota, şehir veya gezi yazısı ara (Örn: Busan, Seul, İtalya)..."
                            className="w-full bg-transparent px-3 py-2.5 font-sans text-sm text-[#1A1918] placeholder-[#1A1918]/40 outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-3 text-xs font-sans font-bold text-[#78746D] hover:text-[#A34828] uppercase shrink-0 cursor-pointer"
                            >
                                Temizle ×
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="font-sans text-[10px] text-[#A34828] uppercase tracking-wider mt-2">
                            "{searchQuery}" araması için {filteredBlogs.length} rota bulundu.
                        </p>
                    )}
                </div>

                {/* Single Unified Routes & Blog Posts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map((blog) => {
                        const imageUrl = blog.image 
                            ? (blog.image.startsWith('http') ? blog.image : `${API_BASE}${blog.image.startsWith('/') ? '' : '/'}${blog.image}`)
                            : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';

                        const destName = (blog.destination && typeof blog.destination === 'object')
                            ? blog.destination.name 
                            : (blog.destination || 'Seyahat Rotası');

                        const dateStr = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

                        return (
                            <div key={blog._id} className="group border border-[#1A1918]/15 bg-[#F4F0E8] flex flex-col justify-between p-5 space-y-4 hover:border-[#A34828]/50 transition-colors">
                                <div className="aspect-[4/3] bg-[#1A1918] overflow-hidden relative">
                                    <img 
                                        src={imageUrl} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover img-editorial-zoom"
                                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800'; }}
                                    />
                                    <div className="absolute top-3 left-3 bg-[#1A1918]/80 text-[#FBF9F5] px-2.5 py-1 text-[9px] font-sans font-bold uppercase tracking-widest backdrop-blur-sm">
                                        {destName}
                                    </div>
                                </div>

                                <div className="space-y-2 flex-grow">
                                    {dateStr && (
                                        <div className="flex items-center gap-1.5 font-sans text-[10px] text-[#78746D] uppercase tracking-wider">
                                            <Calendar size={12} className="text-[#A34828]" />
                                            <span>{dateStr}</span>
                                        </div>
                                    )}
                                    <h3 className="font-serif text-2xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors leading-tight">
                                        {blog.title}
                                    </h3>
                                    <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed line-clamp-3">
                                        {blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'Seyahat rehberini okumak için tıklayın.'}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-[#1A1918]/10">
                                    <Link 
                                        to={`/blog/${blog._id}`} 
                                        className="font-sans text-xs font-bold uppercase tracking-widest text-[#1A1918] hover:text-[#A34828] transition-colors flex items-center justify-between min-h-[40px]"
                                    >
                                        <span>Rotayı Oku</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    {filteredBlogs.length === 0 && (
                        <div className="col-span-full py-16 text-center border border-[#1A1918]/15 bg-[#F4F0E8] p-8 space-y-3">
                            <p className="font-serif text-xl text-[#1A1918]">
                                {searchQuery ? `"${searchQuery}" aramasıyla eşleşen bir rota bulunamadı.` : 'Henüz yayınlanmış bir rota bulunmuyor.'}
                            </p>
                            <p className="font-sans text-xs text-[#78746D]">
                                Admin panelinden yeni bir blog eklediğinizde doğrudan burada görünecektir.
                            </p>
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Destinations;
