import React, { useEffect, useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteTitle: '',
        heroTitle: '',
        heroSubtitle: '',
        heroImage: '',
        destinationsTag: '',
        visitedCount: 0,
        mileCount: '',
        countryCount: 0,
        cityCount: 0,
        announcement: '',
        homepageQuote: '',
        homepageQuoteAuthor: '',
        instagramPostUrl: '',
        instagramPreviewImage: '',
        featuredBlogs: [] // Array of blog IDs
    });
    const [allBlogs, setAllBlogs] = useState([]);

    useEffect(() => {
        fetchSettings();
        fetchBlogs();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/settings`);
            // If featuredBlogs are populated objects, extract IDs for the settings state
            // But wait, the backend sends Objects because of populate().
            // Ideally backend PUT endpoint expects IDs.
            // So on frontend load, we should map them to IDs if they are objects.
            const data = res.data;
            if (data.featuredBlogs && data.featuredBlogs.length > 0 && typeof data.featuredBlogs[0] === 'object') {
                data.featuredBlogs = data.featuredBlogs.map(b => b._id);
            }
            setSettings(prev => ({ ...prev, ...data }));
        } catch (err) { console.error(err); }
    };

    const fetchBlogs = async () => {
        try {
            // Fetch all blogs (simple list for dropdown)
            const res = await axios.get(`${API_BASE}/api/blogs?limit=100`); // Fetch enough blogs
            setAllBlogs(res.data.blogs || res.data);
        } catch (err) { console.error(err); }
    };

    const handleAddFeaturedBlog = (blogId) => {
        if (!blogId) return;
        if (settings.featuredBlogs.includes(blogId)) return;
        if (settings.featuredBlogs.length >= 3) {
            alert('En fazla 3 adet öne çıkan blog seçebilirsiniz.');
            return;
        }
        setSettings({ ...settings, featuredBlogs: [...(settings.featuredBlogs || []), blogId] });
    };

    const handleRemoveFeaturedBlog = (blogId) => {
        setSettings({
            ...settings,
            featuredBlogs: settings.featuredBlogs.filter(id => id !== blogId)
        });
    };

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE}/api/settings`, settings);
            const successDiv = document.createElement('div');
            successDiv.textContent = 'Ayarlar Başarıyla Kaydedildi!';
            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce';
            document.body.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);
        } catch (err) {
            console.error(err);
            alert('Ayarlar kaydedilirken hata oluştu');
        }
    };

    return (
        <AdminLayout title="Site Ayarları">
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Site Adı</label>
                        <input type="text" name="siteTitle" value={settings.siteTitle || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-bold text-gray-800">Ana Sayfa Slaytları</h4>
                            <button
                                type="button"
                                onClick={() => {
                                    if (settings.heroSlides?.length >= 3) {
                                        alert('En fazla 3 slayt ekleyebilirsiniz.');
                                        return;
                                    }
                                    setSettings(prev => ({
                                        ...prev,
                                        heroSlides: [...(prev.heroSlides || []), { image: '', title: '', subtitle: '', link: '' }]
                                    }));
                                }}
                                className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                + Slayt Ekle
                            </button>
                        </div>

                        <div className="space-y-6">
                            {settings.heroSlides?.map((slide, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSlides = settings.heroSlides.filter((_, i) => i !== index);
                                            setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                        }}
                                        className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 8.586 5.707 4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Kapak Görseli</label>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={slide.image}
                                                    onChange={(e) => {
                                                        const newSlides = [...settings.heroSlides];
                                                        newSlides[index].image = e.target.value;
                                                        setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                    }}
                                                    placeholder="/uploads/..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`upload-${index}`}
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files[0];
                                                            if (!file) return;

                                                            const formData = new FormData();
                                                            formData.append('image', file);

                                                            try {
                                                                const res = await axios.post(`${API_BASE}/api/upload`, formData, {
                                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                                });
                                                                const newSlides = [...settings.heroSlides];
                                                                newSlides[index].image = res.data.filePath;
                                                                setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                            } catch (err) {
                                                                console.error("Upload failed", err);
                                                                alert("Resim yüklenemedi!");
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`upload-${index}`}
                                                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                        Yükle
                                                    </label>
                                                </div>
                                            </div>
                                            {slide.image && (
                                                <div className="mt-4 relative rounded-md overflow-hidden border border-gray-200 shadow-sm group">
                                                    <div className="text-[10px] text-gray-500 mb-1 px-1">Önizleme:</div>
                                                    <div
                                                        className="h-40 w-full bg-cover bg-no-repeat bg-gray-100 relative"
                                                        style={{
                                                            backgroundImage: `url('${slide.image.startsWith('http') ? slide.image : `${API_BASE}${slide.image}`}')`,
                                                            backgroundPosition: `center ${slide.imagePosition || '50%'}`
                                                        }}
                                                    >
                                                        {/* Gradient Overlay just like Home */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>

                                                        {/* Text Preview */}
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                                            <h3
                                                                className="text-xl font-serif font-bold mb-2 drop-shadow-md"
                                                                style={{ color: slide.textColor || '#ffffff' }}
                                                            >
                                                                {slide.title || 'Başlık Önizlemesi'}
                                                            </h3>
                                                            <p
                                                                className="text-xs opacity-90 drop-shadow-sm line-clamp-2 max-w-xs"
                                                                style={{ color: slide.textColor || '#ffffff' }}
                                                            >
                                                                {slide.subtitle || 'Alt başlık buraya gelecek...'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Başlık</label>
                                                <input
                                                    type="text"
                                                    value={slide.title}
                                                    onChange={(e) => {
                                                        const newSlides = [...settings.heroSlides];
                                                        newSlides[index].title = e.target.value;
                                                        setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Alt Başlık</label>
                                                <input
                                                    type="text"
                                                    value={slide.subtitle}
                                                    onChange={(e) => {
                                                        const newSlides = [...settings.heroSlides];
                                                        newSlides[index].subtitle = e.target.value;
                                                        setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Yazı Rengi</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={slide.textColor || '#ffffff'}
                                                        onChange={(e) => {
                                                            const newSlides = [...settings.heroSlides];
                                                            newSlides[index].textColor = e.target.value;
                                                            setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                        }}
                                                        className="h-9 w-9 p-0 border-0 rounded overflow-hidden cursor-pointer"
                                                    />
                                                    <span className="text-sm font-mono text-gray-500">{slide.textColor || '#ffffff'}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Görsel Pozisyonu (Dikey)</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        value={parseInt(slide.imagePosition?.replace('%', '') || '50')}
                                                        onChange={(e) => {
                                                            const newSlides = [...settings.heroSlides];
                                                            newSlides[index].imagePosition = `${e.target.value}%`;
                                                            setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                        }}
                                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                    <span className="text-sm font-mono text-gray-500 w-12 text-right">{slide.imagePosition || '50%'}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1">Görselin yukarı/aşağı kaydırılması (%0 üst, %100 alt).</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Link (Örn: /blog/id)</label>
                                            <input
                                                type="text"
                                                value={slide.link}
                                                onChange={(e) => {
                                                    const newSlides = [...settings.heroSlides];
                                                    newSlides[index].link = e.target.value;
                                                    setSettings(prev => ({ ...prev, heroSlides: newSlides }));
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!settings.heroSlides || settings.heroSlides.length === 0) && (
                                <p className="text-sm text-gray-400 text-center italic py-4">Henüz slayt eklenmedi.</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Ana Sayfa Slider (Öne Çıkanlar)</h4>
                        <p className="text-sm text-gray-500 mb-4">Ana sayfa en üst bölümünde görünecek 3 bloğu seçin.</p>

                        <div className="flex gap-2 mb-4">
                            <select
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                                onChange={(e) => handleAddFeaturedBlog(e.target.value)}
                                value=""
                            >
                                <option value="" disabled>Blog Seçin...</option>
                                {allBlogs.map(blog => (
                                    <option key={blog._id} value={blog._id}>{blog.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            {(settings.featuredBlogs || []).map(blogId => {
                                const blog = allBlogs.find(b => b._id === blogId);
                                return (
                                    <div key={blogId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <span className="text-sm font-medium text-gray-700">{blog ? blog.title : 'Yükleniyor...'}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeaturedBlog(blogId)}
                                            className="text-red-500 hover:text-red-700 text-xs font-bold"
                                        >
                                            Kaldır
                                        </button>
                                    </div>
                                );
                            })}
                            {(!settings.featuredBlogs || settings.featuredBlogs.length === 0) && (
                                <p className="text-sm text-gray-400 italic">Henüz blog seçilmedi. En fazla 3 tane seçebilirsiniz.</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Destinasyonlar & İstatistikler</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destinasyon Sloganı (Sol Üst)</label>
                                <input type="text" name="destinationsTag" value={settings.destinationsTag || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Mil</label>
                                <input type="text" name="mileCount" value={settings.mileCount || ''} onChange={handleChange} placeholder="Örn: 850K+" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ülkeler</label>
                                    <input type="number" name="countryCount" value={settings.countryCount || 0} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehirler</label>
                                    <input type="number" name="cityCount" value={settings.cityCount || 0} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">İlham Verici Söz (Özlü Söz)</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ana Sayfa Sözü</label>
                                <textarea name="homepageQuote" value={settings.homepageQuote || ''} onChange={handleChange} rows="2" placeholder="Örn: The world is a book..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent resize-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sözün Sahibi (Yazar)</label>
                                <input type="text" name="homepageQuoteAuthor" value={settings.homepageQuoteAuthor || ''} onChange={handleChange} placeholder="Örn: St. Augustine" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Duyurular</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kayan Yazı Metni (Ana Sayfa)</label>
                            <input type="text" name="announcement" value={settings.announcement || ''} onChange={handleChange} placeholder="Örn: Norveç Gezimiz Çok Yakında!" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                            <p className="text-xs text-gray-400 mt-1">Ana sayfanın en üstünde kayan yazı olarak görünür.</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Google AdSense</h4>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Google AdSense ID</label>
                            <input
                                type="text"
                                name="googleAdSenseId"
                                value={settings.googleAdSenseId || ''}
                                onChange={handleChange}
                                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-1">Reklamların görünmesi için AdSense Yayıncı Kimliğinizi girin.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Google Maps API Key</label>
                            <div className="relative">
                                {/* MapPin component is not defined in this file, assuming it's an external icon or placeholder */}
                                {/* <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /> */}
                                <input
                                    type="text"
                                    name="googleMapsApiKey"
                                    value={settings.googleMapsApiKey || ''}
                                    onChange={handleChange}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Haritanın çalışması için gerekli API anahtarı. (Maps JavaScript API)</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Instagram Tanıtımı</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Son Gönderi Linki</label>
                                <input type="text" name="instagramPostUrl" value={settings.instagramPostUrl || ''} onChange={handleChange} placeholder="https://instagram.com/p/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Önizleme Resmi</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="instagramPreviewImage"
                                        value={settings.instagramPreviewImage || ''}
                                        onChange={handleChange}
                                        placeholder="URL girin veya resim yükleyin ->"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent"
                                    />
                                    <label className="flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors" title="Resim Yükle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append('image', file);
                                            try {
                                                const res = await axios.post(`${API_BASE}/api/upload`, formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                setSettings({ ...settings, instagramPreviewImage: `${API_BASE}${res.data.filePath}` });
                                            } catch (err) {
                                                console.error('Upload error:', err);
                                                alert('Resim yükleme başarısız');
                                            }
                                        }} />
                                    </label>
                                </div>
                                {settings.instagramPreviewImage && (
                                    <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <img src={settings.instagramPreviewImage} alt="Önizleme" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gönderi Sayısı</label>
                                    <input type="text" name="instagramPostCount" value={settings.instagramPostCount || ''} onChange={handleChange} placeholder="Örn: 443" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Takipçi</label>
                                    <input type="text" name="instagramFollowerCount" value={settings.instagramFollowerCount || ''} onChange={handleChange} placeholder="Örn: 102 B" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Takip</label>
                                    <input type="text" name="instagramFollowingCount" value={settings.instagramFollowingCount || ''} onChange={handleChange} placeholder="Örn: 405" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-accent focus:border-accent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-accent transition-colors shadow-md">
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout >
    );
};

export default AdminSettings;
