import React from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, Lock, Eye, CheckCircle, Globe, FileText, ArrowUpRight, Plane, Cloud } from 'lucide-react';
import { motion } from 'motion/react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-700 overflow-hidden relative selection:bg-blue-100">
            <SEO title="Gizlilik Politikası" description="AdSense ve çerez politikalarımız hakkında bilgilendirme." />
            <Navbar />

            {/* Dynamic Background - Travel Theme: Sky & Ocean */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 via-emerald-50 to-white opacity-90" />

                {/* Floating Blobs (Clouds) */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 10, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[10%] left-[10%] text-white/40"
                >
                    <Cloud size={180} fill="white" />
                </motion.div>
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 2 }}
                    className="absolute top-[20%] right-[15%] text-white/30"
                >
                    <Cloud size={120} fill="white" />
                </motion.div>

                {/* Travel Icons */}
                <motion.div
                    animate={{ x: [-100, 1200], y: [50, -50], rotate: [0, 10] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[15%] left-[-10%] text-sky-900/10"
                >
                    <Plane size={140} />
                </motion.div>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-5%] text-emerald-900/5"
                >
                    <Globe size={400} strokeWidth={0.5} />
                </motion.div>

                {/* Abstract Colors */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px] mix-blend-multiply"
                />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
            </div>

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-md shadow-xl shadow-blue-900/5 rounded-2xl mb-8 border border-white/60 ring-1 ring-blue-50"
                >
                    <Shield size={32} className="text-blue-600 drop-shadow-sm" strokeWidth={1.5} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl md:text-4xl font-serif font-black text-slate-800 mb-6 tracking-tight"
                >
                    Gizlilik Politikası
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-xl mx-auto text-sm md:text-sm text-slate-500 leading-relaxed font-normal"
                >
                    Web sitemizi ziyaret ettiğinizde verilerinizin nasıl işlendiği ve
                    <span className="text-blue-600 font-semibold mx-1">Google reklamları</span>
                    hakkında yasal bilgilendirme.
                </motion.p>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/60 shadow-xl shadow-slate-200/50">
                    
                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-blue-500">1.</span> Toplanan Bilgiler ve Kullanımı
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Ceylan.m.e, standart bir prosedür olarak log (günlük) dosyalarını kullanır. Bu dosyalar, siteyi ziyaret ettiğinizde IP adresinizi, tarayıcı türünüzü, İnternet Servis Sağlayıcınızı (İSS), giriş-çıkış sayfalarınızı ve tarih/saat damgalarını kaydeder. Bu veriler kişisel kimliğinizle ilişkilendirilmez; temel amacı eğilimleri analiz etmek, siteyi yönetmek ve güvenliği sağlamaktır.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-blue-500">2.</span> Çerezler (Cookies)
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Kullanıcı deneyimini iyileştirmek ve tercihlerinizi kaydetmek amacıyla çerezler (cookies) kullanılmaktadır. Çerezler, web sitemize yaptığınız ziyaretleri daha verimli hale getirmek için cihazınıza yerleştirilen küçük metin dosyalarıdır.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-blue-500">3.</span> Google AdSense ve Reklam Çerezleri
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Sitemizde üçüncü taraf bir tedarikçi olarak <strong>Google AdSense</strong> ve iş ortakları tarafından sağlanan reklamlar yayınlanmaktadır.
                        </p>
                        <ul className="list-disc pl-5 md:pl-6 text-slate-600 text-sm md:text-base space-y-3 mb-4">
                            <li>Google dahil olmak üzere üçüncü taraf tedarikçiler, web sitemize veya diğer sitelere yaptığınız önceki ziyaretleri temel alan reklamlar yayınlamak için çerezleri (örneğin DoubleClick DART çerezi) kullanır.</li>
                            <li>Google'ın reklam çerezlerini kullanması, kendisinin ve iş ortaklarının internetteki gezintilerinize dayalı kişiselleştirilmiş reklamlar sunmasına olanak tanır.</li>
                            <li>Kişiselleştirilmiş reklamları kapatmak isterseniz, <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">Google Reklam Ayarları</a> sayfasını ziyaret edebilirsiniz. Ayrıca <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2">www.aboutads.info</a> adresinden diğer tedarikçilerin çerez yönetimini de ayarlayabilirsiniz.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-blue-500">4.</span> Üçüncü Taraf Bağlantıları
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Ceylan.m.e'nin Gizlilik Politikası, sitemizde yer alan reklam verenler veya bağlantı verilen harici web siteleri için geçerli değildir. Ziyaret ettiğiniz üçüncü taraf sitelerin kendi Gizlilik Politikalarına başvurmanız gerekmektedir. Tarayıcı ayarlarınız üzerinden çerez kullanımını tamamen devre dışı bırakma hakkınız her zaman saklıdır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-blue-500">5.</span> Kullanıcı Onayı
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Web sitemizi kullanarak, bu Gizlilik Politikasında belirtilen şartları ve verilerinizin burada açıklanan amaçlarla toplanıp kullanılmasını açıkça kabul etmiş sayılırsınız.
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    AdSense ve GDPR Standartlarına Uygun
                </div>
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default PrivacyPolicy;
