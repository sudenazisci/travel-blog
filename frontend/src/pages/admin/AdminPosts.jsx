import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, Edit3, Eye, Clock, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

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

const calculateSeoScore = (blog) => {
    let score = 0;
    if (blog.title && blog.title.length >= 10 && blog.title.length <= 70) score += 20;
    else if (blog.title) score += 10;

    const metaDesc = blog.metaDescription || '';
    if (metaDesc.length >= 100 && metaDesc.length <= 160) score += 20;
    else if (metaDesc.length > 0) score += 10;

    const plainText = blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : '';
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 500) score += 25;
    else if (wordCount >= 300) score += 20;
    else if (wordCount >= 150) score += 10;

    if (blog.image) score += 15;
    if (blog.content && (blog.content.includes('<h2') || blog.content.includes('<h3'))) score += 20;

    return {
        score,
        wordCount,
        readTime: Math.max(1, Math.ceil(wordCount / 200)),
        isAdSenseReady: wordCount >= 300 && score >= 65
    };
};

const AdminPosts = () => {
    const [blogs, setBlogs] = useState([]);
    const [filterQuery, setFilterQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/blogs?limit=100`);
            const fetchedBlogs = res.data.blogs || res.data || [];
            setBlogs(fetchedBlogs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteBlog = async (id) => {
        if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
        try {
            await axios.delete(`${API_BASE}/api/blogs/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchBlogs();
        } catch (err) { 
            console.error(err);
            alert('Yazı silinirken bir hata oluştu.');
        }
    };

    const normalizedFilter = trNormalize(filterQuery);
    const filteredBlogs = blogs.filter(blog => {
        if (!normalizedFilter) return true;
        const normTitle = trNormalize(blog.title);
        const normDest = trNormalize(blog.destination?.name || '');
        return normTitle.includes(normalizedFilter) || normDest.includes(normalizedFilter);
    });

    if (loading) {
        return (
            <AdminLayout title="Tüm Yazıları Yönet">
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Tüm Yazıları Yönet & Detaylı İstatistikler">
            
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Yazı başlığı veya şehir ismi ile ara..."
                    className="w-full sm:w-80 px-4 py-2 text-xs border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-primary bg-white"
                />

                <Link 
                    to="/admin/posts/new" 
                    className="w-full sm:w-auto bg-primary text-white px-5 py-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 text-xs font-bold shadow-xs"
                >
                    <Plus size={16} />
                    <span>Yeni Hikaye Ekle</span>
                </Link>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-left">
                        <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Başlık & Destinasyon</th>
                                <th className="px-6 py-3 text-center">Kelime Sayısı</th>
                                <th className="px-6 py-3 text-center">Okuma Süresi</th>
                                <th className="px-6 py-3 text-center">Görüntülenme</th>
                                <th className="px-6 py-3 text-center">SEO Skoru</th>
                                <th className="px-6 py-3 text-center">AdSense Uyum</th>
                                <th className="px-6 py-3 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-xs">
                            {filteredBlogs.map(blog => {
                                const metrics = calculateSeoScore(blog);
                                return (
                                    <tr key={blog._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="font-bold text-gray-900 line-clamp-1">{blog.title}</div>
                                            <div className="text-gray-400 text-[11px] mt-0.5">
                                                {blog.destination?.name || 'Genel Rota'} · {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center font-mono text-gray-700">
                                            {metrics.wordCount} kelime
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 font-mono text-gray-600">
                                                <Clock size={12} className="text-gray-400" />
                                                {metrics.readTime} dk
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center font-bold font-mono text-gray-900">
                                            <span className="inline-flex items-center gap-1">
                                                <Eye size={13} className="text-emerald-600" />
                                                {(blog.views || 0).toLocaleString()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                metrics.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                                metrics.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                %{metrics.score}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            {metrics.isAdSenseReady ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                    <CheckCircle2 size={12} /> Uyumlu
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                                    <AlertTriangle size={12} /> Uzatılmalı
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-right space-x-3">
                                            <Link 
                                                to={`/admin/posts/edit/${blog._id}`} 
                                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1 font-bold"
                                            >
                                                <Edit3 size={13} /> Düzenle
                                            </Link>
                                            <button 
                                                onClick={() => deleteBlog(blog._id)} 
                                                className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 font-bold cursor-pointer"
                                            >
                                                <Trash2 size={13} /> Sil
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredBlogs.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-gray-500">
                                        Hiç hikaye bulunamadı.
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

export default AdminPosts;
