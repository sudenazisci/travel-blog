import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Marker Icon
const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Map Click Event Handler Component
const MapEvents = ({ onClick }) => {
    useMapEvents({
        click(e) {
            onClick(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
};

// Map Pan/Zoom Controller Component
const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, map.getZoom() || 6);
        }
    }, [center, map]);
    return null;
};

const AdminDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [form, setForm] = useState({ name: '', image: '', description: '', lat: '', lng: '', parent: '', isFeatured: false });
    const [editingId, setEditingId] = useState(null); // ID of item being edited
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/destinations`);
            setDestinations(res.data);
        } catch (err) { console.error(err); }
    };

    const destList = destinations.filter(d => !d.isRegion);
    const regionList = destinations.filter(d => d.isRegion);

    const handleEdit = (dest) => {
        setEditingId(dest._id);
        setForm({
            name: dest.name,
            image: dest.image,
            description: dest.description || '',
            lat: dest.lat || '',
            lng: dest.lng || '',
            parent: dest.parent?._id || '',
            isFeatured: dest.isFeatured || false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', image: '', description: '', lat: '', lng: '', parent: '', isFeatured: false });
    };

    const handleMapClick = (lat, lng) => {
        setForm(prev => ({
            ...prev,
            lat: Number(lat).toFixed(6),
            lng: Number(lng).toFixed(6)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, parent: form.parent === '' ? null : form.parent };
        try {
            if (editingId) {
                // Update
                await axios.put(`${API_BASE}/api/destinations/${editingId}`, payload, {
                    headers: { 'x-auth-token': token }
                });
                alert('Destinasyon Güncellendi');
            } else {
                // Create
                await axios.post(`${API_BASE}/api/destinations`, payload, {
                    headers: { 'x-auth-token': token }
                });
                alert('Destinasyon ve Harita Pini Eklendi');
            }
            handleCancelEdit(); // Reset form
            fetchDestinations();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu destinasyonu silmek istediğinizden emin misiniz?')) return;
        try {
            await axios.delete(`${API_BASE}/api/destinations/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchDestinations();
        } catch (err) { console.error(err); }
    };

    return (
        <AdminLayout title="Destinasyonları Yönet">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center ${editingId ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </span>
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Destinasyonu Düzenle' : 'Destinasyon Harita Pini Ekle'}
                            </h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">
                            {editingId ? 'Aşağıdaki detayları güncelleyin.' : 'Buraya destinasyon eklemek, Dünya Haritası üzerinde otomatik olarak işaretlenmesini sağlar.'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ülke / Şehir Adı</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Örn: Türkiye" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL'si</label>
                                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Üst Kategori / Bölge (İsteğe Bağlı)</label>
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" value={form.parent} onChange={e => setForm({ ...form, parent: e.target.value })}>
                                    <option value="">-- En Üst Düzey --</option>
                                    {regionList
                                        .map(d => (
                                            <option key={d._id} value={d._id}>{d.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                                    checked={form.isFeatured}
                                    onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                                />
                                <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium text-gray-700">
                                    Ana Destinasyonlar Sayfasında Göster (Öne Çıkan)
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (İsteğe Bağlı)</label>
                                <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="3"></textarea>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-800 mb-2 font-medium">Harita Koordinatları</p>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Enlem (Latitude)</label>
                                        <input type="number" step="any" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" value={form.lat || ''} onChange={e => setForm({ ...form, lat: e.target.value })} placeholder="39.93" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Boylam (Longitude)</label>
                                        <input type="number" step="any" className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" value={form.lng || ''} onChange={e => setForm({ ...form, lng: e.target.value })} placeholder="32.85" required />
                                    </div>
                                </div>
                                
                                {/* Picker Map */}
                                <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
                                    <MapContainer
                                        center={[
                                            form.lat !== '' && form.lng !== '' && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) ? parseFloat(form.lat) : 39.93,
                                            form.lat !== '' && form.lng !== '' && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) ? parseFloat(form.lng) : 32.85
                                        ]}
                                        zoom={form.lat !== '' && form.lng !== '' && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) ? 6 : 2}
                                        scrollWheelZoom={true}
                                        className="w-full h-full outline-none z-0"
                                        attributionControl={false}
                                    >
                                        <TileLayer
                                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                        />
                                        <MapEvents onClick={handleMapClick} />
                                        <MapController center={form.lat !== '' && form.lng !== '' && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) ? [parseFloat(form.lat), parseFloat(form.lng)] : null} />
                                        {form.lat !== '' && form.lng !== '' && !isNaN(parseFloat(form.lat)) && !isNaN(parseFloat(form.lng)) && (
                                            <Marker position={[parseFloat(form.lat), parseFloat(form.lng)]} icon={customIcon} />
                                        )}
                                    </MapContainer>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Haritaya tıklayarak koordinatları otomatik olarak seçebilirsiniz.</p>
                            </div>
                            <div className="flex gap-2">
                                {editingId && (
                                    <>
                                        <button type="button" onClick={handleCancelEdit} className="w-1/4 bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                            İptal
                                        </button>
                                        <button type="button" onClick={() => handleDelete(editingId)} className="w-1/4 bg-red-100 text-red-600 font-medium py-2 rounded-lg hover:bg-red-200 transition-colors">
                                            Sil
                                        </button>
                                    </>
                                )}
                                <button type="submit" className={`flex-1 text-white font-medium py-2 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'}`}>
                                    {editingId ? 'Güncelle ve Kaydet' : 'Haritaya Pin Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Aktif Harita Pinleri ({destList.length})</h3>
                        <div className="text-xs text-gray-500">Düzenlemek için bir karta tıklayın</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {destList.map(dest => (
                            <div
                                key={dest._id}
                                onClick={() => handleEdit(dest)}
                                className={`group relative bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all flex flex-col md:flex-row h-auto md:h-32 cursor-pointer ${editingId === dest._id ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-100'}`}
                            >
                                <div className="md:w-32 h-48 md:h-full overflow-hidden">
                                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-between">
                                            {dest.name}
                                            <div className="flex gap-1">
                                                {dest.isFeatured && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">★ Öne Çıkan</span>
                                                )}
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                                                    {dest.lat ? '📍İşaretli' : 'İşaretsiz'}
                                                </span>
                                            </div>
                                        </h4>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{dest.description}</p>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-auto">
                                        <span className="text-xs text-indigo-500 font-medium px-2 py-1 rounded hover:bg-indigo-50">Düzenle</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(dest._id); }}
                                            className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDestinations;
