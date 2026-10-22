import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

const fmtDuration = (sec = 0) => {
    if (sec < 60) return `${sec} sn`;
    const m = Math.floor(sec / 60);
    if (m < 60) return `${m} dk ${sec % 60} sn`;
    return `${Math.floor(m / 60)} sa ${m % 60} dk`;
};

const AdminStatistics = () => {
    const [blogs, setBlogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resetting, setResetting] = useState(false);

    const fetchData = async () => {
        try {
            const [blogsRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/api/blogs?includeDrafts=true`),
                axios.get(`${API_BASE}/api/stats/summary`)
            ]);
            const list = Array.isArray(blogsRes.data) ? blogsRes.data : (blogsRes.data.blogs || []);
            setBlogs([...list].sort((a, b) => (b.views || 0) - (a.views || 0)));
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const id = setInterval(fetchData, 60000);
        return () => clearInterval(id);
    }, []);

    const handleReset = async () => {
        if (!window.confirm('Tüm ziyaretçi verileri ve yazı görüntülenmeleri SİLİNip sıfırlanacak. Bu işlem geri alınamaz. Emin misin?')) return;
        setResetting(true);
        try {
            await axios.delete(`${API_BASE}/api/stats/reset`);
            await fetchData();
        } catch (err) {
            alert('Sıfırlama başarısız oldu.');
        } finally {
            setResetting(false);
        }
    };

    const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
    const mostViewed = blogs.length > 0 ? blogs[0] : null;
    const t = stats?.totals || {};
    const daily = stats?.daily || [];
    const maxDaily = Math.max(1, ...daily.map(d => d.count));

    if (loading) return (
        <AdminLayout title="İstatistikler">
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="İstatistikler">
            {/* Gerçek Ziyaretçi Özeti */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">Yalnızca gerçek ziyaretçiler sayılır. Admin girişi yapılan tarayıcılar, localhost ve yönetim sayfaları hariçtir.</p>
                <button
                    id="reset-stats-btn"
                    onClick={handleReset}
                    disabled={resetting}
                    className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                    {resetting ? 'Sıfırlanıyor...' : 'Tüm İstatistikleri Sıfırla'}
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    ['Farklı Ziyaretçi', (t.uniqueVisitors || 0).toLocaleString(), 'Tekil kişi (tarayıcı)'],
                    ['Şu An Sitede', t.online || 0, 'Son 2 dakika'],
                    ['Bugün Gelen', t.activeToday || 0, 'Tekil ziyaretçi'],
                    ['Son 7 Gün', t.active7d || 0, 'Aktif ziyaretçi'],
                    ['Toplam Giriş (Oturum)', (t.sessions || 0).toLocaleString(), 'Siteye geç gelme sayısı'],
                    ['Sayfa Görüntüleme', (t.pageViews || 0).toLocaleString(), 'Tüm sayfalar'],
                    ['Kişi Başı Ort. Süre', fmtDuration(t.avgSecondsPerVisitor), 'Toplam süre / kişi'],
                    ['Geri Dönen Ziyaretçi', t.returningVisitors || 0, 'Birden fazla geldi']
                ].map(([label, value, hint]) => (
                    <div key={label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{label}</div>
                        <div className="text-2xl font-bold text-gray-800">{value}</div>
                        <div className="text-xs text-gray-400 mt-1">{hint}</div>
                    </div>
                ))}
            </div>

            {/* Son 14 gün */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Son 14 Gün — Günlük Tekil Ziyaretçi</h3>
                <div className="flex items-end gap-2 h-32">
                    {daily.map(d => (
                        <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.date}: ${d.count}`}>
                            <span className="text-[10px] text-gray-500 mb-1">{d.count}</span>
                            <div className="w-full bg-accent rounded-t" style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count ? 4 : 1 }}></div>
                            <span className="text-[9px] text-gray-400 mt-1">{d.date.slice(8)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ziyaretçi Tablosu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Ziyaretçiler (son 100)</h3>
                    <div className="text-sm text-gray-500">Her satır bir kişi/tarayıcı. Kişisel veri (IP, isim) tutulmaz.</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-4 py-3">Kimlik</th>
                                <th className="px-4 py-3">Cihaz</th>
                                <th className="px-4 py-3 text-right">Giriş</th>
                                <th className="px-4 py-3 text-right">Sayfa</th>
                                <th className="px-4 py-3 text-right">Toplam Süre</th>
                                <th className="px-4 py-3">İlk Geliş</th>
                                <th className="px-4 py-3">Son Görülme</th>
                                <th className="px-4 py-3">Son Sayfa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(stats?.visitors || []).map(v => (
                                <tr key={v.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs">{v.id}</td>
                                    <td className="px-4 py-3">{v.device}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{v.visits}</td>
                                    <td className="px-4 py-3 text-right">{v.pageViews}</td>
                                    <td className="px-4 py-3 text-right">{fmtDuration(v.totalSeconds)}</td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(v.firstSeen).toLocaleString('tr-TR')}</td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(v.lastSeen).toLocaleString('tr-TR')}</td>
                                    <td className="px-4 py-3 text-gray-500 truncate max-w-[200px]">{v.lastPath}</td>
                                </tr>
                            ))}
                            {(!stats?.visitors || stats.visitors.length === 0) && (
                                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400">Henüz ziyaretçi verisi yok.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Oturum Başı Ort. Süre</div>
                    <div className="text-3xl font-bold text-gray-800">{fmtDuration(t.avgSecondsPerSession)}</div>
                    <div className="text-xs text-gray-400 mt-2">Her girişte ortalama kalış</div>
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
