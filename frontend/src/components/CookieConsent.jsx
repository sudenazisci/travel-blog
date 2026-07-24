import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Check, ShieldCheck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = ({ onAccept }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500); // Slight delay for better UX
            return () => clearTimeout(timer);
        } else if (consent === 'accepted') {
            onAccept(true);
        }
    }, [onAccept]);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
        onAccept(true);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
        onAccept(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-4 right-4 z-[9999] w-[calc(100%-2rem)] sm:w-80"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group">
                        {/* Decorative Background Glow - Minimal */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-amber-100/30 rounded-full blur-2xl -ml-12 -mt-12 pointer-events-none"></div>

                        {/* Text Content */}
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                                <Cookie className="text-amber-500" size={16} /> Çerezler
                            </h3>
                            <p className="text-slate-500 text-[11px] leading-relaxed mb-1">
                                Deneyiminizi iyileştirmek için çerezleri kullanıyoruz.
                            </p>
                            <Link to="/cookie-policy" className="text-[10px] text-amber-600 font-bold hover:underline">
                                Politikasını İncele
                            </Link>
                        </div>

                        {/* Action Buttons - Compact */}
                        <div className="flex gap-2 w-full relative z-10">
                            <button
                                onClick={handleDecline}
                                className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-slate-600 text-[11px] font-bold rounded-lg transition-all"
                            >
                                Reddet
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 py-2 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-lg shadow-sm transition-all"
                            >
                                Kabul Et
                            </button>
                        </div>

                        {/* Mini Close Button */}
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-3 right-3 text-slate-300 hover:text-slate-500 transition-colors p-1"
                        >
                            <X size={12} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
