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
                    <div className="lg:col-span-4 space-y-3">
                        <Link to="/" className="inline-block font-serif text-2xl font-bold text-[#1A1918] tracking-tight hover:text-[#A34828] transition-colors">
                            Ceylan.m.e
                        </Link>

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

                            <a
                                href="https://www.tiktok.com/@ceylan.m.e"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1918] hover:text-[#A34828] transition-colors flex items-center gap-1"
                                aria-label="TikTok"
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.1V2h-3.56v13.67a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 1 1 2.9-2.9V12.1a6.47 6.47 0 1 0 3.56 5.77V10.9a8.35 8.35 0 0 0 4.89 1.57V8.91a4.85 4.85 0 0 1-1.12-.13Z" />
                                </svg>
                                <span>TIKTOK</span>
                            </a>

                            <span className="text-[#1A1918]/20">•</span>

                            <a
                                href="https://www.threads.net/@ceylan.m.e"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1A1918] hover:text-[#A34828] transition-colors flex items-center gap-1"
                                aria-label="Threads"
                            >
                                <svg
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 21c-5.2 0-8.5-3.5-8.5-9S6.8 3 12 3c4.7 0 7.7 2.7 8.3 7.2.5 4.3-1.4 7.1-5.1 7.1-2.1 0-3.4-1.2-3.4-3s1.3-3 3.2-3c2.4 0 4.1 1.4 4.8 3.4" />
                                    <path d="M16.7 11.4c-.9-1.4-2.4-2.2-4.4-2.2-2.3 0-3.8 1.3-3.8 3.2s1.4 3.1 3.6 3.1c2.3 0 4.1-1.5 4.6-4.1" />
                                </svg>
                                <span>THREADS</span>
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
                            <li><a href="mailto:ceylan.me@outlook.com" className="hover:text-[#A34828] transition-colors uppercase">E-Posta</a></li>
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
