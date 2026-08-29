import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import API_BASE from '../api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const About = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/settings`);
                setSettings(res.data);
            } catch (err) {
                console.error('About page settings error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const aboutSubtitle = settings?.aboutSubtitle || 'Bilinmeyen rotaların heyecanı, antik sokakların fısıltısı ve farklı kültürlerin sıcaklığı... Ceylan.m.e, seyahat tutkusunu yaşayan gezginler için ilham dolu bir pusula.';
    const storyTitle = settings?.aboutStoryTitle || 'Bir Sırt Çantası ve Sonsuz Bir Merakla Başlayan Serüven';
    const storyContent = settings?.aboutStoryContent || `Ceylan.m.e, dünyayı yalnızca harita üzerinden izlemek yerine ona dokunmak, sokaklarında kaybolmak ve yerel insanların gözünden yaşamı anlamak tutkusuyla doğdu.

Tokyo’nun neon ışıklı sokaklarından Kapadokya’nın masalsı vadilerine, Amalfi’nin dik kıyılarından Marakeş’in baharat kokulu çarşılarına uzanan bu yolculukta amacımız; her gezginin kendi rüya seyahatini en doğru ve samimi bilgilerle planlamasını sağlamak.`;
    const aboutImg = settings?.aboutImage || 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1000&auto=format&fit=crop&q=80';
    const fullImgUrl = aboutImg.startsWith('http') ? aboutImg : `${API_BASE}${aboutImg}`;

    const statCountries = settings?.aboutStatsCountries || '25+';
    const statCities = settings?.aboutStatsCities || '100+';
    const statCommunity = settings?.aboutStatsCommunity || settings?.instagramFollowerCount || '100K+';
    const statGuides = settings?.aboutStatsGuides || '500+';

    return (
        <div className="bg-[#FBF9F5] min-h-screen flex flex-col justify-between font-sans text-[#1A1918] antialiased selection:bg-[#A34828]/15 selection:text-[#1A1918]">
            <SEO 
                title="Hakkımda — Ceylan.m.e" 
                description="Ceylan.m.e seyahat günlüğü, gezi rehberleri, fotoğrafçılık ve seyahat hikayeleri." 
            />
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <section className="py-16 md:py-24 border-b border-[#1A1918]/15">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            
                            <div className="lg:col-span-7 space-y-6">
                                <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.25em] block">
                                    CEYLAN’IN SEYAHAT GÜNLÜĞÜ
                                </span>

                                <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] font-normal leading-[1.1] tracking-tight">
                                    {settings?.aboutTitle || 'Dünyayı keşfetmek, anılar biriktirmek ve ilham vermek için yoldayız.'}
                                </h1>

                                <p className="font-sans text-base sm:text-lg text-[#4A4744] font-light max-w-xl leading-relaxed">
                                    {aboutSubtitle}
                                </p>

                                <div className="pt-4 flex items-center gap-4 border-t border-[#1A1918]/15">
                                    <span className="font-serif italic text-xl text-[#1A1918]">Ceylan</span>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#78746D]">
                                        Seyahat Yazarı & İçerik Üreticisi
                                    </span>
                                </div>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="border border-[#1A1918]/15 bg-[#F4F0E8] p-3">
                                    <img
                                        src={settings?.aboutHeroImage || "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&auto=format&fit=crop&q=80"}
                                        alt="Seyahat Görseli"
                                        className="w-full h-[400px] object-cover"
                                    />
                                    <div className="pt-3 font-mono text-[10px] uppercase text-[#78746D] flex justify-between">
                                        <span>{settings?.aboutHeroImageCaption || "KAPADOKYA, TÜRKİYE"}</span>
                                        <span>{settings?.aboutHeroImageCoords || "38.6431° N · 34.8289° E"}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Narrative */}
                <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-20 border-b border-[#1A1918]/15">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5">
                            <div className="border border-[#1A1918]/15 bg-[#F4F0E8] p-3">
                                <img
                                    src={fullImgUrl}
                                    alt="Ceylan"
                                    className="w-full h-[460px] object-cover"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6">
                            <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.25em] block">
                                HİKAYEM
                            </span>

                            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918] font-normal">
                                {storyTitle}
                            </h2>

                            <div className="font-sans text-sm sm:text-base text-[#4A4744] font-light leading-relaxed whitespace-pre-line space-y-4">
                                {storyContent}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-14 bg-[#1A1918] text-[#FBF9F5]">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center font-mono">
                            <div>
                                <span className="block font-serif text-4xl text-[#A34828] mb-1">{statCountries}</span>
                                <span className="text-[10px] uppercase text-[#FBF9F5]/60 tracking-widest">{settings?.aboutStatsCountriesLabel || 'Keşfedilen Ülke'}</span>
                            </div>
                            <div>
                                <span className="block font-serif text-4xl text-[#A34828] mb-1">{statCities}</span>
                                <span className="text-[10px] uppercase text-[#FBF9F5]/60 tracking-widest">{settings?.aboutStatsCitiesLabel || 'Şehir Rehberi'}</span>
                            </div>
                            <div>
                                <span className="block font-serif text-4xl text-[#A34828] mb-1">{statCommunity}</span>
                                <span className="text-[10px] uppercase text-[#FBF9F5]/60 tracking-widest">{settings?.aboutStatsCommunityLabel || 'Gezgin Topluluğu'}</span>
                            </div>
                            <div>
                                <span className="block font-serif text-4xl text-[#A34828] mb-1">{statGuides}</span>
                                <span className="text-[10px] uppercase text-[#FBF9F5]/60 tracking-widest">{settings?.aboutStatsGuidesLabel || 'Fotoğraf & İpucu'}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default About;
