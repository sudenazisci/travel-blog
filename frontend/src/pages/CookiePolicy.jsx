import React from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Cookie, Settings, CheckCircle, Info, XCircle, Palmtree, Sun, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen bg-amber-50/50 font-sans text-gray-700 overflow-hidden relative selection:bg-amber-100">
            <SEO title="Çerez Politikası" description="Çerezler (cookies) hakkında tatlı ve kısa bir bilgilendirme." />
            <Navbar />

            {/* Dynamic Background - Travel Theme: Tropical Beach */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200 via-orange-50 to-white opacity-90" />

                {/* Floating Travel Icons */}
                <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] right-[-5%] text-amber-600/10 origin-bottom"
                >
                    <Palmtree size={300} />
                </motion.div>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[5%] left-[5%] text-orange-500/10"
                >
                    <Sun size={150} />
                </motion.div>

                <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] left-[10%] text-teal-500/10"
                >
                    <Camera size={120} />
                </motion.div>

                {/* Atmosphere */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-20%] right-[30%] w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[120px] mix-blend-multiply"
                />

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
            </div>

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-4 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-md shadow-xl shadow-amber-900/5 rounded-full mb-8 border border-amber-100 ring-4 ring-amber-50"
                >
                    <Cookie size={48} className="text-amber-500 drop-shadow-sm" strokeWidth={1.5} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl md:text-4xl font-serif font-black text-slate-800 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700"
                >
                    Çerez Politikamız
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-xl mx-auto text-sm md:text-sm text-slate-500 leading-relaxed font-medium"
                >
                    Hayır, yenebilen <span className="text-amber-600 font-bold underline decoration-amber-200 decoration-2 underline-offset-4">kurabiyeler</span> değil maalesef.
                    Ama site deneyiminiz için en az onlar kadar önemliler.
                </motion.p>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/60 shadow-xl shadow-amber-900/5">
                    
                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-amber-500">1.</span> Çerez (Cookie) Nedir?
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Çerezler, web sitemizi ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar sayesinde web sitesi, tercihlerinizi (dil, tema vb.) ve hareketlerinizi belirli bir süre boyunca hatırlar; böylece siteye her girişinizde aynı bilgileri tekrar girmek zorunda kalmazsınız.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-amber-500">2.</span> Çerezleri Hangi Amaçlarla Kullanıyoruz?
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Sitemizde çerezleri temel olarak üç amaçla kullanmaktayız:
                        </p>
                        <ul className="list-disc pl-5 md:pl-6 text-slate-600 text-sm md:text-base space-y-3 mb-4">
                            <li><strong>Zorunlu Çerezler:</strong> Sitenin temel işlevlerini yerine getirebilmesi için (güvenlik, oturum yönetimi) mutlaka gereklidir.</li>
                            <li><strong>Performans ve Analiz Çerezleri:</strong> Sitemizi nasıl kullandığınızı analiz ederek performansımızı artırmamızı sağlar. Hangi sayfaların daha çok ziyaret edildiğini anlamamıza yardımcı olur.</li>
                            <li><strong>Hedefleme ve Reklam Çerezleri:</strong> Size ilgi alanlarınıza yönelik, kişiselleştirilmiş reklamlar göstermek için üçüncü taraf ağlar tarafından kullanılır.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-amber-500">3.</span> Üçüncü Taraf Reklam Çerezleri (Google AdSense)
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Ceylan.m.e, reklam yayınlamak için <strong>Google AdSense</strong> gibi üçüncü taraf reklam ağlarıyla çalışır. Bu bağlamda:
                        </p>
                        <ul className="list-disc pl-5 md:pl-6 text-slate-600 text-sm md:text-base space-y-3 mb-4">
                            <li>Google ve üçüncü taraf tedarikçiler, sitemizi veya internetteki diğer siteleri ziyaretlerinize bağlı olarak reklam sunmak için çerezleri (özellikle DoubleClick DART çerezlerini) kullanır.</li>
                            <li>Bu çerezler, internet gezinme alışkanlıklarınızı takip ederek size en alakalı reklamların sunulmasını sağlar.</li>
                            <li>Sitemizi kullanmaya devam ederek, Google'ın ve reklam ortaklarının çerez politikalarını kabul etmiş olursunuz.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3 flex items-center gap-2">
                            <span className="text-amber-500">4.</span> Çerez Kontrolü ve Devre Dışı Bırakma
                        </h2>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                            Çerezleri kullanmak istemiyorsanız, tarayıcınızın ayarlarından çerezleri tamamen engelleyebilir, silebilir veya çerez gönderildiğinde uyarı almayı seçebilirsiniz. Ancak çerezleri devre dışı bıraktığınızda sitemizin bazı özelliklerinin tam çalışmayabileceğini unutmayın.
                        </p>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            Kişiselleştirilmiş reklamları kapatmak için <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 font-medium underline underline-offset-2">Google Reklam Ayarları</a> adresini veya üçüncü taraf çerezleri için <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 font-medium underline underline-offset-2">AboutAds</a> adresini ziyaret edebilirsiniz.
                        </p>
                    </section>
                </div>

                <div className="mt-12 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    Şeffaf ve Kullanıcı Odaklı Çerez Politikası
                </div>
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default CookiePolicy;
