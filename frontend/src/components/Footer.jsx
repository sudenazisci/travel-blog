import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
    const handleOpenCookieSettings = (e) => {
        e.preventDefault();
        window.dispatchEvent(new Event('open_cookie_preferences'));
    };

    return (
        <footer className="bg-[#F4F0E8] text-[#1A1918] border-t border-[#1A1918]/15 pt-8 pb-6 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Broadside Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-[#1A1918]/15">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-5 space-y-2.5">
                        <Link to="/" className="inline-block font-serif text-2xl font-bold text-[#1A1918] tracking-tight hover:text-[#A34828] transition-colors">
                            Ceylan.m.e.
                        </Link>
                        
                        <p className="font-serif text-sm text-[#1A1918] italic leading-relaxed max-w-sm">
                            “Kadim yollarında kaybolmak ve özgün seyahat hikayeleri biriktirmek için kişisel seyahat günlüğü.”
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            <a 
                                href="https://www.instagram.com/ceylan.m.e/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1918] hover:text-[#A34828] transition-colors flex items-center gap-1"
                                aria-label="Instagram"
                            >
                                <Instagram size={13} />
                                <span>INSTAGRAM</span>
                            </a>
                            <span className="text-[#1A1918]/20">•</span>
                            <a 
                                href="https://www.youtube.com/@Ceylan.m.e" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1918] hover:text-[#A34828] transition-colors flex items-center gap-1"
                                aria-label="YouTube"
                            >
                                <Youtube size={13} />
                                <span>YOUTUBE</span>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigasyon */}
                    <div className="lg:col-span-2 space-y-2">
                        <h4 className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-[0.2em]">
                            NAVİGASYON
                        </h4>
                        <ul className="space-y-1 font-mono text-[11px] text-[#4A4744]">
                            <li><Link to="/" className="hover:text-[#A34828] transition-colors uppercase">Ana Sayfa</Link></li>
                            <li><Link to="/destinations" className="hover:text-[#A34828] transition-colors uppercase">Rotalar</Link></li>
                            <li><Link to="/about" className="hover:text-[#A34828] transition-colors uppercase">Hakkımda</Link></li>
                            <li><Link to="/contact" className="hover:text-[#A34828] transition-colors uppercase">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: İletişim */}
                    <div className="lg:col-span-2 space-y-2">
                        <h4 className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-[0.2em]">
                            İLETİŞİM
                        </h4>
                        <ul className="space-y-1 font-mono text-[11px] text-[#4A4744]">
                            <li><Link to="/contact" className="hover:text-[#A34828] transition-colors uppercase">Bize Ulaşın</Link></li>
                            <li><Link to="/contact" className="hover:text-[#A34828] transition-colors uppercase">Ortaklık</Link></li>
                            <li><a href="mailto:sudenazisci@gmail.com" className="hover:text-[#A34828] transition-colors uppercase">E-Posta</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Yasal Politikalar */}
                    <div className="lg:col-span-3 space-y-2">
                        <h4 className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-[0.2em]">
                            YASAL
                        </h4>
                        <ul className="space-y-1 font-mono text-[11px] text-[#4A4744]">
                            <li><Link to="/privacy-policy" className="hover:text-[#A34828] transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-[#A34828] transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link to="/cookie-policy" className="hover:text-[#A34828] transition-colors">Çerez Politikası</Link></li>
                            <li><Link to="/advertising-policy" className="hover:text-[#A34828] transition-colors">Reklam ve Yayın Politikası</Link></li>
                            <li>
                                <button onClick={handleOpenCookieSettings} className="text-[#A34828] hover:underline font-mono text-[11px] cursor-pointer">
                                    ● Çerez Tercihleri
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Line */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[9px] uppercase text-[#78746D]">
                    <p>© {new Date().getFullYear()} Ceylan.m.e • Seyahat Günlüğü</p>
                    <span className="text-[#78746D]">Tüm Hakları Saklıdır</span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
