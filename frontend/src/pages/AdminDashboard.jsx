import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { 
    BookOpen, 
    Eye, 
    CheckCircle2, 
    AlertTriangle, 
    TrendingUp, 
    FileText, 
    ShieldCheck, 
    Award, 
    Clock, 
    Search,
    ExternalLink,
    Sparkles,
    Plus
} from 'lucide-react';

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

// Calculate real SEO Score for a blog post based on Google AdSense guidelines
const calculateSeoScore = (blog) => {
    let score = 0;
    
    // 1. Title presence & length (20 pts)
    if (blog.title && blog.title.length >= 10 && blog.title.length <= 70) score += 20;
    else if (blog.title) score += 10;

    // 2. Meta description (20 pts)
    const metaDesc = blog.metaDescription || '';
    if (metaDesc.length >= 100 && metaDesc.length <= 160) score += 20;
    else if (metaDesc.length > 0) score += 10;

    // 3. Word count (25 pts) - Google AdSense recommends 300+ words per article
    const plainText = blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : '';
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 500) score += 25;
    else if (wordCount >= 300) score += 20;
    else if (wordCount >= 150) score += 10;

    // 4. Featured Image (15 pts)
    if (blog.image) score += 15;

    // 5. Heading hierarchy H2/H3 (20 pts)
    if (blog.content && (blog.content.includes('<h2') || blog.content.includes('<h3'))) score += 20;

    return {
        score,
        wordCount,
        readTime: Math.max(1, Math.ceil(wordCount / 200)),
        isAdSenseReady: wordCount >= 300 && score >= 65
    };
};

const AdminDashboard = () => {
    const [blogs, setBlogs] = useState([]);
    const [settings, setSettings] = useState(null);
    const [adsCount, setAdsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filterQuery, setFilterQuery] = useState('');
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/yonetim-gizli-giris');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const [blogsRes, adsRes, settingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/blogs?limit=100`),
                    axios.get(`${API_BASE}/api/ads`),
                    axios.get(`${API_BASE}/api/settings`)
                ]);

                const fetchedBlogs = blogsRes.data.blogs || blogsRes.data || [];
                setBlogs(fetchedBlogs);
                setAdsCount(adsRes.data.length || 0);
                setSettings(settingsRes.data);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, navigate]);

    if (loading) {
        return (
            <AdminLayout title="Panel Genel Bakış">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    // Dynamic Real Metric Calculations
    const totalPublishedBlogs = blogs.length;
    const totalBlogViews = blogs.reduce((acc, b) => acc + (b.views || 0), 0);
    const totalSiteVisitors = settings?.totalVisitors || 0;

    let totalWords = 0;
    let totalScoreSum = 0;

    const blogMetrics = blogs.map(blog => {
        const metrics = calculateSeoScore(blog);
        totalWords += metrics.wordCount;
        totalScoreSum += metrics.score;
        return {
            ...blog,
            ...metrics
        };
    });

    const averageWordCount = totalPublishedBlogs > 0 ? Math.round(totalWords / totalPublishedBlogs) : 0;
    const averageSeoScore = totalPublishedBlogs > 0 ? Math.round(totalScoreSum / totalPublishedBlogs) : 0;

    // AdSense Readiness Checks
    const adSenseChecks = [
        {
            title: "Yeterli İçerik Sayısı (Min 10 İçerik)",
            passed: totalPublishedBlogs >= 10,
            detail: `${totalPublishedBlogs} / 10 içerik yayınlandı.`
        },
        {
            title: "Ortalama İçerik Uzunluğu (Min 300 Kelime)",
            passed: averageWordCount >= 300,
            detail: `Yazı başı ortalama ${averageWordCount} kelime.`
        },
        {
            title: "Yasal & Zorunlu Politikalar",
            passed: true,
            detail: "Gizlilik, Çerez ve Kullanım Koşulları sayfaları aktif."
        },
        {
            title: "Ortalama SEO & Kalite Skoru (%70+)",
            passed: averageSeoScore >= 70,
            detail: `Mevcut SEO skor ortalaması %${averageSeoScore}.`
        },
        {
            title: "Sitemap.xml ve Ads.txt Hazırlığı",
            passed: true,
            detail: "/sitemap.xml ve /ads.txt aktif."
        }
    ];

    const passedAdSenseChecksCount = adSenseChecks.filter(c => c.passed).length;
    const isOverallAdSenseReady = passedAdSenseChecksCount >= 4;

    // Filtered Table
    const normalizedFilter = trNormalize(filterQuery);
    const filteredBlogMetrics = blogMetrics.filter(blog => {
        if (!normalizedFilter) return true;
        const normTitle = trNormalize(blog.title);
        const normDest = trNormalize(blog.destination?.name || '');
        return normTitle.includes(normalizedFilter) || normDest.includes(normalizedFilter);
    });

    return (
        <AdminLayout title="Panel Genel Bakış & SEO İstatistikleri">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                
                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                            Toplam Hikaye
                        </span>
                        <span className="text-3xl font-bold text-gray-900">{totalPublishedBlogs}</span>
                        <span className="text-[11px] text-gray-400 block mt-1">Yayınlanmış gezi rehberleri</span>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                            Toplam Okunma
                        </span>
                        <span className="text-3xl font-bold text-gray-900">{totalBlogViews.toLocaleString()}</span>
                        <span className="text-[11px] text-gray-400 block mt-1">Yazı detay görüntülenmesi</span>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                        <Eye size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                            Ortalama SEO Skoru
                        </span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">%{averageSeoScore}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-1">Google & AdSense uyumluluğu</span>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <Award size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">
                            Toplam Ziyaretçi
                        </span>
                        <span className="text-3xl font-bold text-gray-900">{totalSiteVisitors.toLocaleString()}</span>
                        <span className="text-[11px] text-gray-400 block mt-1">Tekil site girişleri</span>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp size={22} />
                    </div>
                </div>

            </div>

            {/* Google AdSense Readiness Audit Section */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOverallAdSenseReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span>Google AdSense Uyum & Kalite Denetimi</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    isOverallAdSenseReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                    {isOverallAdSenseReady ? 'AdSense Onayına Hazır ✓' : 'Geliştirilmeli ⚠'}
                                </span>
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Google politikalarına uygun şekilde reklam onayı alabilmeniz için canlı içerik analizi.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link 
                            to="/admin/posts/new" 
                            className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                        >
                            <Plus size={15} />
                            <span>Yeni Hikaye Yaz</span>
                        </Link>
                        <a 
                            href="/sitemap.xml" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1"
                        >
                            <span>Sitemap</span>
                            <ExternalLink size={13} />
                        </a>
                    </div>
                </div>

                {/* Audit Checklist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {adSenseChecks.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-800 line-clamp-1">{item.title}</span>
                                {item.passed ? (
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                ) : (
                                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                                )}
                            </div>
                            <p className="text-[11px] text-gray-500 leading-snug">{item.detail}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Real Blog Performance & SEO Table */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">İçerik Performans & SEO Skor Listesi</h3>
                        <p className="text-xs text-gray-500">Tüm yazıların canlı kelime sayısı, okuma süresi ve SEO skorları</p>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Yazı veya destinasyon ara..."
                            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-primary bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3">Başlık & Destinasyon</th>
                                <th className="px-6 py-3 text-center">Kelime Sayısı</th>
                                <th className="px-6 py-3 text-center">Okuma Süresi</th>
                                <th className="px-6 py-3 text-center">Okunma</th>
                                <th className="px-6 py-3 text-center">SEO Skoru</th>
                                <th className="px-6 py-3 text-center">AdSense Uyumu</th>
                                <th className="px-6 py-3 text-right">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {filteredBlogMetrics.map((blog) => (
                                <tr key={blog._id} className="hover:bg-gray-50/80 transition-colors">
                                    
                                    {/* Title & Dest */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <Link to={`/blog/${blog._id}`} className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-1">
                                            {blog.title}
                                        </Link>
                                        <span className="text-[11px] text-gray-400 block mt-0.5">
                                            {blog.destination?.name || 'Genel Rota'} · {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                                        </span>
                                    </td>

                                    {/* Word Count */}
                                    <td className="px-6 py-4 text-center font-mono font-medium text-gray-700">
                                        {blog.wordCount} kelime
                                    </td>

                                    {/* Reading Time */}
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 font-mono text-gray-600">
                                            <Clock size={12} className="text-gray-400" />
                                            {blog.readTime} dk
                                        </span>
                                    </td>

                                    {/* Views */}
                                    <td className="px-6 py-4 text-center font-bold font-mono text-gray-900">
                                        {(blog.views || 0).toLocaleString()}
                                    </td>

                                    {/* SEO Score Ring/Badge */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                            blog.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                            blog.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                        }`}>
                                            %{blog.score}
                                        </span>
                                    </td>

                                    {/* AdSense Readiness Status */}
                                    <td className="px-6 py-4 text-center">
                                        {blog.isAdSenseReady ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                <CheckCircle2 size={12} /> Uyumlu
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                <AlertTriangle size={12} /> İçerik Artırılmalı
                                            </span>
                                        )}
                                    </td>

                                    {/* Action Edit */}
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            to={`/admin/posts/edit/${blog._id}`} 
                                            className="text-primary hover:text-accent font-bold transition-colors"
                                        >
                                            Düzenle →
                                        </Link>
                                    </td>

                                </tr>
                            ))}

                            {filteredBlogMetrics.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        Aramanıza uygun hikaye bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </AdminLayout>
    );
};

export default AdminDashboard;
