import React, { useState, useEffect } from 'react';
import API_BASE from '../api';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { ArrowUpRight, Copy, Check, Mail, Instagram, Youtube, Handshake } from 'lucide-react';

const Contact = () => {
    const [settings, setSettings] = useState(null);
    const [copiedEmail, setCopiedEmail] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE}/api/settings`)
            .then(res => setSettings(res.data))
            .catch(() => {});
    }, []);

    const handleCopyEmail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText('sudenazisci@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1918] flex flex-col justify-between font-sans selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <SEO 
                title="İletişim — Ceylan.m.e" 
                description="Ceylan.m.e seyahat günlüğü ile iletişime geçin. Rota önerileri, marka iş birlikleri ve seyahat projeleriniz için doğrudan kanallar." 
            />
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-5 space-y-6">
                        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#A34828] uppercase block">
                            İLETİŞİM & ORTAKLIK
                        </span>

                        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#1A1918] leading-[1.1] tracking-tight">
                            Birlikte yeni bir rota çizelim.
                        </h1>

                        <p className="font-sans text-base text-[#4A4744] font-light leading-relaxed max-w-md">
                            Bir seyahat önerisi, marka iş birliği teklifi veya yayın projeleriniz için doğrudan kanallarımdan bana ulaşabilirsiniz.
                        </p>
                    </div>

                    {/* RIGHT COLUMN: Stylish Distinct Card Boxes ("Kutucuk Kutucuk") */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        {/* 01. E-POSTA KUTUSU */}
                        <div className="border border-[#1A1918]/15 bg-[#F4F0E8] p-6 flex flex-col justify-between space-y-4 group hover:border-[#A34828] transition-colors shadow-xs">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                                        <span className="text-[#A34828]">01</span>
                                        <span className="text-[#1A1918] uppercase tracking-widest">E-POSTA</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#FBF9F5] border border-[#1A1918]/15 text-[#A34828] flex items-center justify-center">
                                        <Mail size={16} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors">
                                        Doğrudan İletişim
                                    </h3>
                                    <p className="font-mono text-xs text-[#1A1918] font-bold pt-1 break-all">
                                        sudenazisci@gmail.com
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#1A1918]/10 flex items-center justify-between">
                                <button
                                    onClick={handleCopyEmail}
                                    className="font-mono text-[11px] font-bold text-[#78746D] hover:text-[#A34828] transition-colors inline-flex items-center gap-1 cursor-pointer"
                                >
                                    {copiedEmail ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                    <span>{copiedEmail ? 'Kopyalandı ✓' : 'Adresi Kopyala'}</span>
                                </button>
                                <a
                                    href="mailto:sudenazisci@gmail.com"
                                    className="text-[#1A1918] hover:text-[#A34828] transition-colors"
                                >
                                    <ArrowUpRight size={18} />
                                </a>
                            </div>
                        </div>

                        {/* 02. INSTAGRAM KUTUSU */}
                        <div className="border border-[#1A1918]/15 bg-[#F4F0E8] p-6 flex flex-col justify-between space-y-4 group hover:border-[#A34828] transition-colors shadow-xs">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                                        <span className="text-[#A34828]">02</span>
                                        <span className="text-[#1A1918] uppercase tracking-widest">INSTAGRAM</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#FBF9F5] border border-[#1A1918]/15 text-[#A34828] flex items-center justify-center">
                                        <Instagram size={16} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors">
                                        @ceylan.m.e
                                    </h3>
                                    <p className="font-sans text-xs text-[#78746D] pt-1">
                                        Anlık seyahat hikayeleri & canlı rotalar
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#1A1918]/10 flex items-center justify-between">
                                <a
                                    href={settings?.instagramPostUrl || "https://www.instagram.com/ceylan.m.e/"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-[11px] font-bold text-[#1A1918] group-hover:text-[#A34828] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
                                >
                                    <span>Profili İncele</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                        {/* 03. YOUTUBE KUTUSU */}
                        <div className="border border-[#1A1918]/15 bg-[#F4F0E8] p-6 flex flex-col justify-between space-y-4 group hover:border-[#A34828] transition-colors shadow-xs">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                                        <span className="text-[#A34828]">03</span>
                                        <span className="text-[#1A1918] uppercase tracking-widest">YOUTUBE</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#FBF9F5] border border-[#1A1918]/15 text-[#A34828] flex items-center justify-center">
                                        <Youtube size={16} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors">
                                        @Ceylan.m.e
                                    </h3>
                                    <p className="font-sans text-xs text-[#78746D] pt-1">
                                        Sinematik seyahat günlükleri & rehberler
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#1A1918]/10 flex items-center justify-between">
                                <a
                                    href={settings?.youtubeUrl || "https://www.youtube.com/@Ceylan.m.e"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-[11px] font-bold text-[#1A1918] group-hover:text-[#A34828] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
                                >
                                    <span>Kanala Git</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                        {/* 04. MARKA İŞ BİRLİKLERİ KUTUSU */}
                        <div className="border border-[#1A1918]/15 bg-[#F4F0E8] p-6 flex flex-col justify-between space-y-4 group hover:border-[#A34828] transition-colors shadow-xs">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-mono text-xs font-bold">
                                        <span className="text-[#A34828]">04</span>
                                        <span className="text-[#1A1918] uppercase tracking-widest">ORTAKLIK</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-[#FBF9F5] border border-[#1A1918]/15 text-[#A34828] flex items-center justify-center">
                                        <Handshake size={16} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl font-normal text-[#1A1918] group-hover:text-[#A34828] transition-colors">
                                        Sponsorluk & Yayın
                                    </h3>
                                    <p className="font-sans text-xs text-[#78746D] pt-1">
                                        Turizm kurulları, otel & marka ortaklıkları
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-[#1A1918]/10 flex items-center justify-between">
                                <a
                                    href="mailto:sudenazisci@gmail.com?subject=Marka%20İş%20Birliği%20Teklifi"
                                    className="font-mono text-[11px] font-bold text-[#1A1918] group-hover:text-[#A34828] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
                                >
                                    <span>Teklif Gönder</span>
                                    <ArrowUpRight size={14} />
                                </a>
                            </div>
                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
};

export default Contact;
