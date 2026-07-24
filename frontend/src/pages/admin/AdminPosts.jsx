import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const AdminPosts = () => {
    const [blogs, setBlogs] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const res = await axios.get(`${API_BASE}/api/blogs`);
        setBlogs(res.data);
    };

    const deleteBlog = async (id) => {
        if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;
        try {
            await axios.delete(`${API_BASE}/api/blogs/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchBlogs();
        } catch (err) { console.error(err); }
    };

    return (
        <AdminLayout title="Yazıları Yönet">
            <div className="flex justify-end mb-6">
                <Link to="/admin/posts/new" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors flex items-center shadow-md">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Yeni Hikaye
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {blogs.map(blog => (
                            <tr key={blog._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{blog.title}</div>
                                    <div className="text-gray-500 text-sm truncate max-w-xs">{blog.slug || 'no-slug'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(blog.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yayınlandı</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/posts/edit/${blog._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Düzenle</Link>
                                    <button onClick={() => deleteBlog(blog._id)} className="text-red-600 hover:text-red-900">Sil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default AdminPosts;
