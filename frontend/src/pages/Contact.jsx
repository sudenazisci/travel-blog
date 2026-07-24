import React, { useState } from 'react';
import API_BASE from '../api';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axios.post(`${API_BASE}/api/contact`, formData);
            setStatus({ type: 'success', message: res.data.message });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO title="İletişim - Ceylan.m.e" description="Ceylan.m.e ekibiyle iletişime geçin. İşbirlikleri ve sorularınız için bize yazın." />
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">İletişim</h1>
                    <p className="text-gray-600 mb-8 max-w-2xl">
                        Soru, görüş veya işbirliği önerileriniz için aşağıdaki formu doldurabilir veya doğrudan <a href="mailto:sudenazisci@gmail.com" className="text-accent font-bold hover:underline">sudenazisci@gmail.com</a> adresine e-posta gönderebilirsiniz.
                    </p>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adınız Soyadınız</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                                    placeholder="Adınız" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresiniz</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                                    placeholder="ornek@email.com" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                            <input 
                                type="text" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                                placeholder="Mesajınızın konusu" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                            <textarea 
                                name="message"
                                required
                                rows="5" 
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" 
                                placeholder="Mesajınızı buraya yazın..."
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-accent transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    GÖNDERİLİYOR...
                                </>
                            ) : 'GÖNDER'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;
