import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

const AdminStatistics = () => {
    const [blogs, setBlogs] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [blogsRes, settingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/blogs`),
                    axios.get(`${API_BASE}/api/settings`)
                ]);

                // Sort by views descending
                const sortedBlogs = blogsRes.data.sort((a, b) => (b.views || 0) - (a.views || 0));
                setBlogs(sortedBlogs);
                setSettings(settingsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
    const mostViewed = blogs.length > 0 ? blogs[0] : null;
    const totalSiteVisitors = settings?.totalVisitors || 0;

    if (loading) return (
        <AdminLayout title="İstatistikler">
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="İstatistikler">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Toplam Site Ziyaretçisi</div>
                    <div className="text-3xl font-bold text-gray-800">{totalSiteVisitors.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 mt-2">Ana sayfa ve diğer tüm girişler</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Toplam Blog Okunma</div>
                    <div className="text-3xl font-bold text-gray-800">{totalViews.toLocaleString()}</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Toplam Yazı</div>
                    <div className="text-3xl font-bold text-gray-800">{blogs.length}</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Ortalama Görüntülenme</div>
                    <div className="text-3xl font-bold text-gray-800">
                        {blogs.length > 0 ? Math.round(totalViews / blogs.length) : 0}
                    </div>
                </div>
            </div>

            {/* Most Viewed Highlight */}
            {mostViewed && (
                <div className="bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg p-6 mb-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">En Popüler Yazı</div>
                            <h3 className="text-2xl font-serif font-bold mb-2">{mostViewed.title}</h3>
                            <div className="flex items-center space-x-2">
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    {mostViewed.views || 0} görüntülenme
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            )}

            {/* Stats Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Yazı Performansı</h3>
                    <div className="text-sm text-gray-500">Görüntülenme sayısına göre sıralı</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sıra</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Başlık</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destinasyon</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Görüntülenme</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Durum</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {blogs.map((blog, index) => (
                                <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">#{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {blog.destination ? blog.destination.name : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                                        {(blog.views || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-accent h-2 rounded-full"
                                                    style={{ width: `${mostViewed ? ((blog.views || 0) / (mostViewed.views || 1)) * 100 : 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminStatistics;
