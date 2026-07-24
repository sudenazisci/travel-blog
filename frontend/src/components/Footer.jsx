import React from 'react';
import { Link } from 'react-router-dom';
import TextType from './TextType';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-10 md:pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Collaboration CTA */}
                <div className="max-w-4xl mx-auto mb-10 md:mb-16">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"></div>
                        <div className="text-center md:text-left relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 font-serif tracking-tight h-[30px] md:h-[36px] flex items-center justify-center md:justify-start">
                                <TextType
                                    text={["İşbirliği ve Reklamlar"]}
                                    typingSpeed={50}
                                    deletingSpeed={30}
                                    pauseDuration={2000}
                                    loop={true}
                                    showCursor={true}
                                    cursorCharacter="|"
                                />
                            </h3>
                            <p className="text-gray-500 text-sm md:text-base">Marka işbirlikleri ve projeleriniz için iletişime geçin.</p>
                        </div>
                        <Link
                            to="/contact"
                            className="relative z-10 flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl group/btn transform hover:-translate-y-1 overflow-hidden"
                        >
                            <span className="tracking-widest uppercase text-[10px] md:text-xs text-nowrap">Bize Ulaşın</span>
                            <div className="p-1 bg-white/20 rounded-full group-hover/btn:bg-white group-hover/btn:text-black transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8 mb-10 md:mb-12">
                    <div className="col-span-2 lg:col-span-1">
                        <Link to="/" className="text-xl md:text-2xl font-serif font-bold text-gray-900 tracking-tighter">
                            Ceylan<span className="text-accent">.m.e</span>
                        </Link>
                        <p className="mt-3 md:mt-4 text-gray-500 text-sm leading-relaxed max-w-xs">
                            Dünyayı keşfetmek, yeni kültürler tanımak ve unutulmaz anılar biriktirmek için rehberiniz.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Keşfet</h4>
                        <ul className="space-y-2 text-[13px] md:text-sm text-gray-500">
                            <li><Link to="/destinations" className="hover:text-accent transition-colors text-nowrap">Destinasyonlar</Link></li>
                            <li><Link to="/about" className="hover:text-accent transition-colors">Hakkımızda</Link></li>
                            <li><Link to="/contact" className="hover:text-accent transition-colors">İletişim</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Yasal</h4>
                        <ul className="space-y-2 text-[13px] md:text-sm text-gray-500">
                            <li><Link to="/privacy-policy" className="hover:text-accent transition-colors text-nowrap">Gizlilik Politikası</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-accent transition-colors text-nowrap">Kullanım Şartları</Link></li>
                            <li><Link to="/cookie-policy" className="hover:text-accent transition-colors text-nowrap">Çerez Politikası</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-2 lg:col-span-1 border-t border-gray-100 lg:border-0 pt-8 lg:pt-0">
                        <h4 className="font-bold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Takip Et</h4>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/ceylan.m.e/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="https://www.youtube.com/@Ceylan.m.e" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                                <span className="sr-only">YouTube</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-gray-100 text-center text-[11px] md:text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Ceylan.m.e. Tüm hakları saklıdır.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
