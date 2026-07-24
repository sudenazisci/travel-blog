import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ posts: 0, ads: 0, totalViews: 0 });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    if (!token) navigate('/yonetim-gizli-giris');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [blogsRes, adsRes, settingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/blogs`),
                    axios.get(`${API_BASE}/api/ads`),
                    axios.get(`${API_BASE}/api/settings`)
                ]);

                // Calculate total blog views
                const totalBlogViews = blogsRes.data.reduce((acc, blog) => acc + (blog.views || 0), 0);

                // You can choose to show Total Site Visitors OR Total Blog Views here. 
                // Let's show Total Site Visitors as "Total Views" for the dashboard summary, 
                // or sum them up. Usually "Total Views" implies page views.
                const totalSiteVisitors = settingsRes.data.totalVisitors || 0;

                // Let's display Total Site Visitors for now as it's more "global"
                setStats({
                    posts: blogsRes.data.length,
                    ads: adsRes.data.length,
                    totalViews: totalSiteVisitors
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout title="Panel Genel Bakış">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Toplam Hikaye</div>
                    <div className="text-4xl font-bold text-gray-900">{stats.posts}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Aktif Reklam Kampanyaları</div>
                    <div className="text-4xl font-bold text-gray-900">{stats.ads}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Toplam Site Ziyaretçisi</div>
                    <div className="text-4xl font-bold text-gray-900">{stats.totalViews ? stats.totalViews.toLocaleString() : 0}</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/web-analytics-illustration-download-in-svg-png-gif-file-formats--dashboard-seo-data-business-activites-pack-illustrations-3791097.png" alt="Analytics" className="w-64 mb-6 opacity-80" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tekrar Hoş Geldiniz, Yönetici!</h3>
                <p className="text-gray-500 max-w-md">İçeriğinizi, ayarlarınızı yönetmek veya yeni bir hikaye yazmak için sol menüden bir seçenek belirleyin.</p>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;

