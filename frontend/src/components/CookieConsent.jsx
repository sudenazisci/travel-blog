import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const CookieConsent = ({ onAccept }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Simplified categories
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: true
    });

    useEffect(() => {
        const stored = localStorage.getItem('cookie_consent_preferences');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences(parsed);
                if (onAccept) onAccept(!!parsed.marketing);
            } catch {
                setIsVisible(true);
            }
        } else {
            // First time visitor - show after slight delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [onAccept]);

    // Listen for custom event from footer "Çerez Tercihleri" link
    useEffect(() => {
        const handleOpen = () => {
            setShowModal(true);
            setIsVisible(true);
        };
        window.addEventListener('open_cookie_preferences', handleOpen);
        return () => window.removeEventListener('open_cookie_preferences', handleOpen);
    }, []);

    const savePreferences = (prefs) => {
        const finalPrefs = { ...prefs, necessary: true, timestamp: new Date().toISOString() };
        localStorage.setItem('cookie_consent_preferences', JSON.stringify(finalPrefs));
        localStorage.setItem('cookie_consent', finalPrefs.marketing ? 'accepted' : 'rejected');
        setPreferences(finalPrefs);
        setIsVisible(false);
        setShowModal(false);
        if (onAccept) onAccept(!!finalPrefs.marketing);
        window.dispatchEvent(new Event('cookie_consent_updated'));
    };

    const handleAcceptAll = () => {
        savePreferences({
            necessary: true,
            analytics: true,
            marketing: true
        });
    };

    const handleRejectAll = () => {
        savePreferences({
            necessary: true,
            analytics: false,
            marketing: false
        });
    };

    const handleSaveCustom = () => {
        savePreferences(preferences);
    };

    if (!isVisible && !showModal) return null;

    return (
        <>
            {/* 1. COMPACT USER-FRIENDLY BOTTOM COOKIE BANNER */}
            {isVisible && !showModal && (
                <aside 
                    aria-label="Çerez Bildirimi"
                    className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-[9999] max-w-md w-auto select-none animate-fadeInUp"
                >
                    <div className="bg-white border border-[#e8e4dc] rounded-2xl p-4 sm:p-5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] text-stone-900 flex flex-col gap-3">
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#c25e36]">
                                <Cookie size={16} />
                                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-stone-900">
                                    Çerez Tercihleri
                                </h3>
                            </div>
                            
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-stone-400 hover:text-stone-700 transition-colors p-1"
                                aria-label="Kapat"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Concise, non-technical description */}
                        <p className="text-xs text-stone-600 font-light leading-relaxed">
                            Site deneyimini geliştirmek ve izin vermeniz halinde analiz ve reklam hizmetleri sunmak için çerezler kullanıyoruz.
                        </p>

                        {/* Equal Action Buttons + Manage Link */}
                        <div className="pt-1 flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleRejectAll}
                                    className="py-2 px-3 rounded-xl border border-[#ded7cb] hover:bg-stone-50 text-stone-800 text-xs font-mono font-medium transition-colors text-center"
                                >
                                    Reddet
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="py-2 px-3 rounded-xl bg-[#1c1917] hover:bg-[#c25e36] text-white text-xs font-mono font-bold transition-colors text-center shadow-xs"
                                >
                                    Tümünü Kabul Et
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-stone-500">
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="text-[#c25e36] hover:underline font-semibold"
                                >
                                    Tercihleri Yönet
                                </button>
                                <Link to="/cookie-policy" className="hover:underline text-stone-400 hover:text-stone-600">
                                    Çerez Politikası
                                </Link>
                            </div>
                        </div>

                    </div>
                </aside>
            )}

            {/* 2. COMPACT PREFERENCES MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#e8e4dc] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-stone-900 max-h-[90vh] overflow-y-auto flex flex-col justify-between animate-fadeIn">
                        
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-[#ede8e1] mb-4">
                                <div className="flex items-center gap-2 text-[#c25e36]">
                                    <ShieldCheck size={18} />
                                    <h3 className="font-serif text-lg text-stone-900 font-medium">
                                        Çerez Tercihleri
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* 1. Gerekli */}
                                <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#ede8e1] flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-mono font-bold text-stone-900">Gerekli</h4>
                                        <p className="text-[11px] text-stone-500 font-light mt-0.5">
                                            Sitenin temel işlevleri için gereklidir.
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-mono text-[#c25e36] font-bold bg-[#c25e36]/10 px-2 py-0.5 rounded">
                                        AKTİF
                                    </span>
                                </div>

                                {/* 2. Analitik */}
                                <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#ede8e1] flex items-center justify-between">
                                    <div className="pr-3">
                                        <h4 className="text-xs font-mono font-bold text-stone-900">Analitik</h4>
                                        <p className="text-[11px] text-stone-500 font-light mt-0.5">
                                            Site kullanımını anlamamıza yardımcı olur.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.analytics}
                                            onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#c25e36]"></div>
                                    </label>
                                </div>

                                {/* 3. Reklam / Pazarlama */}
                                <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#ede8e1] flex items-center justify-between">
                                    <div className="pr-3">
                                        <h4 className="text-xs font-mono font-bold text-stone-900">Reklam / Pazarlama</h4>
                                        <p className="text-[11px] text-stone-500 font-light mt-0.5">
                                            İzin vermeniz halinde reklam hizmetlerinin çalışmasını sağlar.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.marketing}
                                            onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-8 h-4 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#c25e36]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Buttons */}
                        <div className="pt-4 mt-4 border-t border-[#ede8e1] flex gap-2">
                            <button
                                onClick={handleRejectAll}
                                className="flex-1 py-2 px-3 rounded-xl border border-[#ded7cb] text-stone-700 text-xs font-mono font-semibold hover:bg-stone-50 transition-colors"
                            >
                                Reddet
                            </button>
                            <button
                                onClick={handleSaveCustom}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#1c1917] hover:bg-[#c25e36] text-white text-xs font-mono font-bold transition-colors shadow-xs"
                            >
                                Tercihleri Kaydet
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
