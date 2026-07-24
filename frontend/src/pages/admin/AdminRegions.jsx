import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

const AdminRegions = () => {
    const [destinations, setDestinations] = useState([]);
    const [form, setForm] = useState({ name: '', image: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchRegions();
    }, []);

    const fetchRegions = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/destinations`);
            // Filter only regions
            setDestinations(res.data.filter(d => d.isRegion));
        } catch (err) { console.error(err); }
    };

    const handleEdit = (dest) => {
        setEditingId(dest._id);
        setForm({
            name: dest.name,
            image: dest.image,
            description: dest.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', image: '', description: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, isRegion: true, parent: null }; // Regions are always top level here
            if (editingId) {
                await axios.put(`${API_BASE}/api/destinations/${editingId}`, payload, {
                    headers: { 'x-auth-token': token }
                });
                alert('Bölge Güncellendi');
            } else {
                await axios.post(`${API_BASE}/api/destinations`, payload, {
                    headers: { 'x-auth-token': token }
                });
                alert('Bölge Oluşturuldu');
            }
            handleCancelEdit();
            fetchRegions();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu bölgeyi silmek istediğinizden emin misiniz?')) return;
        try {
            await axios.delete(`${API_BASE}/api/destinations/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchRegions();
        } catch (err) { console.error(err); }
    };

    return (
        <AdminLayout title="Coğrafi Bölgeleri Yönet">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">{editingId ? 'Bölgeyi Düzenle' : 'Yeni Bölge Ekle'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bölge Adı</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Örn: Avrupa" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL'si</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                                <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="3"></textarea>
                            </div>
                            <div className="flex gap-2">
                                {editingId && <button type="button" onClick={handleCancelEdit} className="w-1/3 bg-gray-200 rounded-lg">İptal</button>}
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">{editingId ? 'Bölgeyi Güncelle' : 'Bölge Ekle'}</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destinations.map(dest => (
                        <div key={dest._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden flex shadow-sm cursor-pointer hover:shadow-md" onClick={() => handleEdit(dest)}>
                            <div className="w-24 h-24 flex-shrink-0">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex-1">
                                <h4 className="font-bold text-gray-900">{dest.name}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{dest.description}</p>
                                <div className="mt-2 flex justify-end gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(dest._id); }} className="text-red-500 text-xs px-2 py-1 bg-red-50 rounded">Sil</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminRegions;
