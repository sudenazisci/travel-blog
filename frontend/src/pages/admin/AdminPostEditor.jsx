import React, { useState, useEffect, useRef, useMemo } from 'react';
import API_BASE from '../../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const AdminPostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        slug: '',
        metaTitle: '',
        metaDescription: '',
        destination: '',
        region: '',
        imagePosition: '50%',
        isDraft: false
    });

    const [destinations, setDestinations] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isCreatingCity, setIsCreatingCity] = useState(false);
    const [newCityName, setNewCityName] = useState('');
    const [isQuillImageSelection, setIsQuillImageSelection] = useState(false);
    const quillRef = useRef(null);

    useEffect(() => {
        fetchDestinations();
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchDestinations = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/destinations`);
            setDestinations(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchPost = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/blogs/${id}`);
            const blog = res.data;
            setFormData({
                title: blog.title || '',
                content: blog.content || '',
                image: blog.image || '',
                slug: blog.slug || '',
                metaTitle: blog.metaTitle || '',
                metaDescription: blog.metaDescription || '',
                destination: (blog.destination && typeof blog.destination === 'object') ? blog.destination._id : (blog.destination || ''),
                region: blog.destination?.parent ? (typeof blog.destination.parent === 'object' ? blog.destination.parent._id : blog.destination.parent) : '',
                imagePosition: blog.imagePosition || '50%',
                isDraft: blog.isDraft || false
            });

            if (blog.destination) {
                const destId = (typeof blog.destination === 'object' && blog.destination) ? blog.destination._id : blog.destination;
                // Try to find full destination object in current list or fetch if needed
                // For now, rely on what we have or just set what we know.
                // If the blog has a populated destination with parent, use it.
                const destObj = blog.destination;
                if (destObj && destObj.parent) {
                    setFormData(prev => ({ ...prev, region: (typeof destObj.parent === 'object' && destObj.parent) ? destObj.parent._id : destObj.parent }));
                }
            }
        } catch (err) { console.error(err); }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const res = await axios.post(`${API_BASE}/api/upload`, formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Construct full URL (assuming backend is on port 5000)
            const fullUrl = `${API_BASE}${res.data.filePath}`;
            setFormData({ ...formData, image: fullUrl });
            setUploading(false);
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('Yükleme başarısız');
        }
    };

    const openGallery = async () => {
        setShowGallery(true);
        try {
            const res = await axios.get(`${API_BASE}/api/upload/files`);
            setGalleryImages(res.data);
        } catch (err) { console.error(err); }
    };

    const selectImage = (imageUrl) => {
        if (isQuillImageSelection) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', imageUrl);
            setIsQuillImageSelection(false);
        } else {
            setFormData({ ...formData, image: imageUrl });
        }
        setShowGallery(false);
    };

    // Custom Image Handler for Quill
    const imageHandler = () => {
        setIsQuillImageSelection(true);
        openGallery();
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const handleDelete = async () => {
        if (!confirm('Bu hikayeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) return;
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        try {
            await axios.delete(`${API_BASE}/api/blogs/${id}`, config);
            navigate('/admin/posts');
        } catch (err) {
            console.error(err);
            alert('Yazı silinirken bir hata oluştu');
        }
    };

    const handleGalleryUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            await axios.post(`${API_BASE}/api/upload`, formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Refresh gallery after upload
            const fileRes = await axios.get(`${API_BASE}/api/upload/files`);
            setGalleryImages(fileRes.data);
            setUploading(false);
        } catch (err) {
            console.error(err);
            setUploading(false);
            alert('Yükleme başarısız');
        }
    };

    const handleSubmit = async (e, targetDraftState = false) => {
        if (e && e.preventDefault) e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        try {
            let finalDestinationId = formData.destination;

            // Handle inline city creation
            if (isCreatingCity && newCityName) {
                if (!formData.image) {
                    alert('Lütfen önce bir Öne Çıkan Görsel yükleyin (bu yeni Şehir için de kullanılacaktır).');
                    return;
                }
                const newDestRes = await axios.post(`${API_BASE}/api/destinations`, {
                    name: newCityName,
                    image: formData.image,
                    description: `${newCityName} güzelliklerini keşfedin.`,
                    parent: formData.region,
                    lat: 0, lng: 0
                }, config);
                finalDestinationId = newDestRes.data._id;
            } else if (!finalDestinationId && !formData.region) {
                // Nothing selected?
            } else if (!finalDestinationId) {
                finalDestinationId = formData.region; // Fallback to region
            }

            const payload = { 
                ...formData, 
                destination: finalDestinationId,
                isDraft: targetDraftState
            };

            if (id) {
                await axios.put(`${API_BASE}/api/blogs/${id}`, payload, config);
            } else {
                await axios.post(`${API_BASE}/api/blogs`, payload, config);
            }
            navigate('/admin/posts');
        } catch (err) {
            console.error(err);
            alert('Yazı kaydedilirken bir hata oluştu');
        }
    };

    return (
        <AdminLayout title={id ? "Hikayeyi Düzenle" : "Yeni Hikaye"}>
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Öne Çıkan Görsel URL'si</label>
                            <div className="flex gap-2">
                                <input type="text" name="image" value={formData.image} onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" placeholder="https://..." />
                                <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Yükle
                                    <input type="file" className="hidden" onChange={handleUpload} />
                                </label>
                                <button type="button" onClick={openGallery} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Galeri
                                </button>
                            </div>
                            {uploading && <p className="text-xs text-accent mt-1">Yükleniyor...</p>}

                            {/* Image Position Control */}
                            {formData.image && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-medium text-gray-500">Görsel Pozisyonu (Dikey)</label>
                                        <span className="text-xs font-mono text-gray-500">{formData.imagePosition || '50%'}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={parseInt(formData.imagePosition?.replace('%', '') || '50')}
                                        onChange={(e) => setFormData({ ...formData, imagePosition: `${e.target.value}%` })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-2"
                                    />
                                    <p className="text-[10px] text-gray-400 mb-3">Kapak görselini yukarı/aşağı kaydırın.</p>

                                    {/* Preview */}
                                    <div className="relative rounded-md overflow-hidden border border-gray-200 shadow-sm group">
                                        <div className="text-[10px] text-gray-500 mb-1 px-1 absolute top-1 left-1 bg-white/80 rounded z-10">Önizleme</div>
                                        <div
                                            className="h-48 w-full bg-cover bg-no-repeat bg-gray-100 relative"
                                            style={{
                                                backgroundImage: `url('${formData.image.startsWith('http') ? formData.image : `${API_BASE}${formData.image}`}')`,
                                                backgroundPosition: `center ${formData.imagePosition || '50%'}`
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                                <h3 className="text-xl font-serif font-bold mb-2 text-white drop-shadow-md">
                                                    {formData.title || 'Başlık Önizlemesi'}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bölge</label>
                            <select
                                name="region"
                                value={formData.region}
                                onChange={e => setFormData({ ...formData, region: e.target.value, destination: '' })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                            >
                                <option value="">Bir Bölge Seçin...</option>
                                {(destinations || []).filter(d => d && d.isRegion).map(dest => (
                                    <option key={dest._id} value={dest._id}>{dest.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Şehir / Ülke</label>
                            {isCreatingCity ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCityName}
                                        onChange={e => setNewCityName(e.target.value)}
                                        className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-accent focus:border-accent bg-blue-50"
                                        placeholder="Yeni Şehir Adı Girin"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { setIsCreatingCity(false); setFormData({ ...formData, destination: '' }); }}
                                        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <select
                                    name="destination"
                                    value={formData.destination}
                                    onChange={(e) => {
                                        if (e.target.value === 'NEW') {
                                            setIsCreatingCity(true);
                                            setFormData({ ...formData, destination: '' });
                                        } else {
                                            setFormData({ ...formData, destination: e.target.value });
                                        }
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                                    disabled={!formData.region}
                                >
                                    <option value="">Bir Şehir Seçin...</option>
                                    <option value="NEW" className="font-bold text-accent">+ Yeni Şehir Ekle</option>
                                    {(destinations || [])
                                        .filter(d => d && (d.parent === formData.region || (d.parent && (d.parent._id === formData.region || (typeof d.parent === 'object' && d.parent._id === formData.region)))))
                                        .map(dest => (
                                            <option key={dest._id} value={dest._id}>{dest.name}</option>
                                        ))}
                                </select>
                            )}
                        </div>
                    </div>

                    {formData.image && (
                        <div className="h-48 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (Zengin Metin)</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            modules={modules}
                            className="bg-white rounded-lg h-96 mb-12"
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">SEO Ayarları</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL Kısa Adı / Slug (İsteğe Bağlı)</label>
                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" placeholder="harika-seyahatim" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Başlığı</label>
                            <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklaması</label>
                            <textarea name="metaDescription" rows="3" value={formData.metaDescription} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-20 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div>
                        {id && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-6 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                            >
                                🗑️ Hikayeyi Sil
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3 items-center">
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin/posts')} 
                            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                            İptal
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => handleSubmit(e, true)} 
                            className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-800 font-medium rounded-lg hover:bg-amber-100 transition-colors text-sm"
                        >
                            📁 Taslak Kaydet
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => handleSubmit(e, false)} 
                            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-accent transition-colors shadow-md text-sm"
                        >
                            🚀 {id ? 'Güncelle & Yayınla' : 'Yayına Al'}
                        </button>
                    </div>
                </div>
            </form >

            {/* Gallery Modal */}
            {
                showGallery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">Medya Kütüphanesi</h3>
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 text-sm font-bold shadow-sm">
                                        <span>☁️ Yeni Yükle</span>
                                        <input type="file" className="hidden" onChange={handleGalleryUpload} />
                                    </label>
                                    <button onClick={() => setShowGallery(false)} className="text-gray-500 hover:text-red-500">
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 bg-gray-100">
                                {galleryImages.length === 0 ? (
                                    <div className="text-center py-20 text-gray-500">
                                        Görsel bulunamadı. Önce bir tane yükleyin!
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {galleryImages.map((img, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => selectImage(img.url)}
                                                className="cursor-pointer group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-accent"
                                            >
                                                <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t bg-white text-right">
                                <button onClick={() => setShowGallery(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-800 font-medium">
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </AdminLayout >
    );
};

export default AdminPostEditor;
