import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children, title }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/yonetim-gizli-giris');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Panel', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/admin/posts', label: 'Tüm Yazılar', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
        { path: '/admin/destinations', label: 'Destinasyonlar', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/admin/regions', label: 'Bölgeler', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { path: '/admin/settings', label: 'Site Ayarları', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
        { path: '/admin/statistics', label: 'İstatistikler', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { path: '/admin/ai-generator', label: 'AI Blog Yazarı', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex-shrink-0 hidden md:block">
                <div className="h-16 flex items-center px-4 border-b border-gray-700">
                    <div className="bg-white px-3 py-1 rounded-xl shadow-md w-full flex items-center justify-center">
                        <img src="/logo.png" alt="Ceylan.m.e." className="h-10 w-auto object-contain" />
                    </div>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-accent text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                            </svg>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors mt-8"
                    >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Çıkış Yap</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
                    <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Yönetici</span>
                        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">A</div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
