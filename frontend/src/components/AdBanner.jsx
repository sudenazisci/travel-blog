import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE from '../api';
import { Link } from 'react-router-dom';
import { ExternalLink, Megaphone } from 'lucide-react';

const AdBanner = ({ location = 'sidebar', className = '' }) => {
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchAd = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/ads?location=${location}`);
                if (isMounted && res.data && res.data.length > 0) {
                    const activeAds = res.data.filter(a => a.active);
                    if (activeAds.length > 0) {
                        const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
                        setAd(randomAd);
                    } else {
                        setAd(null);
                    }
                } else if (isMounted) {
                    setAd(null);
                }
            } catch (err) {
                console.error('Ad fetch error:', err);
                if (isMounted) setAd(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAd();
        return () => { isMounted = false; };
    }, [location]);

    if (loading) return null;

    // Fallback editorial banner when no active ad is present
    if (!ad) {
        if (location === 'sidebar') {
            return (
                <div className={`w-full border border-[#1A1918]/15 bg-[#F4F0E8] p-4 space-y-2.5 select-none ${className}`}>
                    <div className="flex items-center justify-between border-b border-[#1A1918]/15 pb-2">
                        <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest flex items-center gap-1">
                            <Megaphone size={12} />
                            SPONSORLUK
                        </span>
                    </div>

                    <h4 className="font-serif font-normal text-base text-[#1A1918] leading-tight">
                        Markanızı Gezginlere Ulaştırın
                    </h4>
                    
                    <p className="font-sans text-xs text-[#4A4744] font-light leading-relaxed">
                        İşletmenizi veya seyahat ürünlerinizi okurlarımızla buluşturun.
                    </p>

                    <Link 
                        to="/contact" 
                        className="block w-full py-2 bg-[#1A1918] hover:bg-[#A34828] text-[#FBF9F5] font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-colors min-h-[34px]"
                    >
                        İletişime Geç ↗
                    </Link>
                </div>
            );
        }

        // In-post banner: Clean, elegant broadside row matching cream canvas
        return (
            <div className={`my-8 border border-[#1A1918]/15 bg-[#F4F0E8] p-4 text-[#1A1918] select-none ${className}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border border-[#1A1918]/20 bg-[#FBF9F5] text-[#A34828] flex items-center justify-center shrink-0">
                            <Megaphone size={16} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest bg-[#FBF9F5] px-2 py-0.5 border border-[#1A1918]/10">
                                    SPONSORLUK
                                </span>
                                <h4 className="font-serif font-normal text-base text-[#1A1918]">
                                    Markanızı Gezginlere Ulaştırın
                                </h4>
                            </div>
                            <p className="font-sans text-xs text-[#4A4744] font-light hidden sm:block">
                                İşletmenizi veya ürünlerinizi öne çıkarmak için bizimle iletişime geçin.
                            </p>
                        </div>
                    </div>
                    
                    <Link 
                        to="/contact" 
                        className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2 bg-[#1A1918] hover:bg-[#A34828] text-[#FBF9F5] font-mono text-[10px] font-bold uppercase tracking-widest transition-colors min-h-[36px]"
                    >
                        <span>İletişime Geç</span>
                        <ExternalLink size={12} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`my-6 border border-[#1A1918]/15 bg-[#F4F0E8] overflow-hidden select-none ${className}`}>
            <div className="px-3 py-1.5 bg-[#1A1918] flex items-center justify-between text-[#FBF9F5] font-mono text-[10px]">
                <span className="text-[#A34828] uppercase tracking-widest font-bold">
                    Sponsorlu
                </span>
                <span className="truncate max-w-[180px]">{ad.title || 'Reklam'}</span>
            </div>

            <div className="p-3">
                {ad.type === 'code' && ad.code ? (
                    <div 
                        className="ad-code-wrapper overflow-hidden bg-white p-2" 
                        dangerouslySetInnerHTML={{ __html: ad.code }} 
                    />
                ) : (
                    <a 
                        href={ad.link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block group/link"
                    >
                        {ad.imageUrl ? (
                            <div className="overflow-hidden">
                                <img 
                                    src={ad.imageUrl.startsWith('http') ? ad.imageUrl : `${API_BASE}${ad.imageUrl}`} 
                                    alt={ad.title || 'Reklam'} 
                                    className="w-full h-auto max-h-[320px] object-cover img-editorial-zoom"
                                />
                            </div>
                        ) : (
                            <div className="p-6 bg-[#1A1918] text-[#FBF9F5] text-center">
                                <h4 className="font-serif text-lg mb-2 text-[#FBF9F5]">{ad.title}</h4>
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-[#A34828]">
                                    Detaylı Bilgi İçin Tıklayın →
                                </span>
                            </div>
                        )}
                    </a>
                )}
            </div>
        </div>
    );
};

export default AdBanner;
