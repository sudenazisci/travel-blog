import React from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen, Smile, AlertCircle, Share2, Heart, MessageCircle, Mountain, Compass, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-700 overflow-hidden relative selection:bg-purple-100">
            <SEO title="Kullanım Şartları" description="Ceylan.m.e kullanım koşulları." />
            <Navbar />

            {/* Dynamic Background - Travel Theme: Sunset Adventure */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200 via-indigo-100 to-white opacity-90" />

                {/* Floating Travel Icons */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] right-[5%] text-rose-900/10"
                >
                    <Mountain size={200} />
                </motion.div>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] left-[5%] text-indigo-900/10"
                >
                    <Compass size={150} />
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[20%] text-orange-400/20"
                >
                    <Sun size={120} />
                </motion.div>

                {/* Atmosphere */}
                <motion.div
                    animate={{ x: [0, 50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[30%] w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-[100px] mix-blend-multiply"
                />
                <motion.div
                    animate={{ x: [0, -50, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[100px] mix-blend-multiply"
                />

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-soft-light"></div>
            </div>

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-4 text-center relative z-10 block">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-flex items-center justify-center p-4 bg-white/80 backdrop-blur-md shadow-xl shadow-purple-900/5 rounded-2xl mb-8 border border-white/60 ring-1 ring-purple-50"
                >
                    <BookOpen size={32} className="text-purple-600 drop-shadow-sm" strokeWidth={1.5} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl md:text-4xl font-serif font-black text-slate-800 mb-6 tracking-tight"
                >
                    Kurallar Kitabı
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-xl mx-auto text-sm md:text-sm text-slate-500 leading-relaxed font-normal"
                >
                    Aramızdaki hukuku belirleyen, ama daha çok karşılıklı <span className="text-purple-600 font-semibold">saygı</span> ve <span className="text-purple-600 font-semibold">nezakete</span> dayanan küçük prensiplerimiz.
                </motion.p>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 relative z-10">
                <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/60 shadow-xl shadow-purple-900/5 text-slate-700">
                    
                    <section className="mb-8">
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Ceylan.m.e, seyahat planlaması ve destinasyon keşfi konusunda bilgilendirici içerikler sunan bir kişisel seyahat günlüğü ve dijital yayın platformudur. Web sitemizde yer alan içerikler; gezi rehberleri, rota önerileri ve seyahat ipuçları gibi bilgilendirme amaçlı paylaşımlardan oluşur. Siteyi kullanarak bu içeriklere erişebilir ve sunduğumuz hizmetlerden yararlanabilirsiniz.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Web sitemizi kullanmanız, kullanım şartlarımızı ve gizlilik politikamızı okuduğunuz ve kabul ettiğiniz anlamına gelir. Bu metinler; site kullanımına ilişkin temel kuralları, içeriklerden yararlanma koşullarını ve kullanıcı haklarını açıklar.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3">
                            Yasal Uyarı
                        </h2>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Ceylan.m.e'de yer alan içerikler; seyahat deneyimlerimize, kişisel gözlemlerimize ve genel bilgilendirme amaçlı derlemelerimize dayanır. Sitede sunulan bilgiler seyahat danışmanlığı kapsamında değildir ve profesyonel/bağlayıcı nitelik taşımaz. İçeriklerde yer alan öneri ve yorumlar kişisel değerlendirmelerdir; her kullanıcının beklentisi, koşulları ve tercihleri farklı olabileceğinden, bu değerlendirmeler sizin seyahat planınıza uygun sonuçlar doğurmayabilir.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Sitede yer alan bilgi ve içerikler doğruluk, güncellik ve eksiksizlik açısından azami özenle hazırlanmakla birlikte; içeriklerde veya yararlanılan kaynaklarda oluşabilecek hata/eksikliklerden ya da bilgilerin kullanımı sonucunda doğabilecek doğrudan veya dolaylı zararlar, kayıplar, maliyetler nedeniyle Ceylan.m.e yönetimi ve yazarları sorumluluk kabul etmez.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Seyahat planı yapmadan önce, özellikle vize/ikamet koşulları, güvenlik durumları, sağlık gereklilikleri, ulaşım kuralları ve resmi ücretler gibi konularda ilgili resmî kurumların güncel duyurularını kontrol etmenizi ve gerekli araştırmayı yapmanızı öneririz.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3">
                            Site Telif Hakları
                        </h2>
                        <p className="text-xs md:text-sm leading-relaxed mb-4 font-medium italic text-slate-500">
                            5846 sayılı Fikir ve Sanat Eserleri Kanunu kapsamında yasal uyarıdır.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Ceylan.m.e'nin alan adı/markası, adı ve logosu; site tasarımı, metinleri, fotoğrafları, videoları, grafik ve görsel unsurları ile sitede yer alan tüm içerik ve dokümanlara ilişkin her türlü hak saklıdır.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Sitede aksi açıkça belirtilmedikçe; Ceylan.m.e'de yer alan hiçbir içerik, doküman, görsel, tasarım unsuru veya diğer materyaller yazılı izin alınmaksızın kısmen ya da tamamen:
                        </p>
                        <ul className="list-disc pl-5 md:pl-6 text-xs md:text-sm space-y-2 mb-4">
                            <li>kopyalanamaz, çoğaltılamaz, değiştirilemez,</li>
                            <li>başka bir mecraya taşınamaz veya yeniden yayımlanamaz,</li>
                            <li>alıntılanamaz, dağıtılamaz, işlenemez,</li>
                            <li>ticari amaçla veya ticari amaç olmaksızın kullanılamaz.</li>
                        </ul>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Bu yasak, içeriğin internet ortamında farklı şekillerde yeniden kullanılması ve arama motorlarının geçici önbellek kayıtları üzerinden elde edilmesi hâllerini de kapsar. Sitemizdeki içeriklerin herhangi bir mecrada kullanılabilmesi için önceden yazılı izin alınması gerekmektedir.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3">
                            Gizlilik İlkeleri
                        </h2>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Ceylan.m.e olarak kişisel verilerinizin gizliliğine ve güvenliğine önem veriyoruz. Web sitemizi ziyaretiniz kapsamında işlenen kişisel veriler; 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) başta olmak üzere ilgili mevzuata uygun olarak, belirli, açık ve meşru amaçlarla ve veri minimizasyonu ilkesi gözetilerek işlenir.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3">
                            Reklamlar ve Üçüncü Taraf Çerezleri
                        </h2>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Sitemizde üçüncü taraf reklam sağlayıcılarına ait reklamlar yayınlanabilir (ör. Google AdSense). Bu reklamlar kapsamında, çerezler (cookies) ve benzeri teknolojiler kullanılabilir; cihaz ve tarayıcı bilgileriniz, reklamların sunulması, sıklık sınırlandırması ve reklam performansının analiz edilmesi gibi amaçlarla üçüncü taraflar tarafından toplanabilir ve işlenebilir.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Ceylan.m.e olarak, üçüncü taraf reklam sağlayıcılarının topladığı veriler üzerinde sınırlı kontrole sahibiz. Üçüncü tarafların kişisel verileri nasıl işlediğine ilişkin detaylar, ilgili sağlayıcıların kendi gizlilik politikalarında yer alır. Çerez tercihlerinizi dilediğiniz zaman tarayıcı ayarlarınız üzerinden yönetebilir, çerezleri silebilir veya engelleyebilirsiniz.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 font-serif border-b border-slate-100 pb-3">
                            Dış Bağlantılar (Atıfta Bulunma)
                        </h2>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Ceylan.m.e'de, ziyaretçilere kolaylık sağlamak amacıyla üçüncü taraf web sitelerine yönlendiren dış bağlantılar (linkler) yer alabilir. Bu bağlantılar yalnızca bilgilendirme amaçlıdır.
                        </p>
                        <p className="text-xs md:text-sm leading-relaxed mb-4">
                            Sitemiz; bağlantı verilen üçüncü taraf sitelerin içerikleri, güncelliği, doğruluğu, güvenliği, sundukları hizmetler ile gizlilik politikaları ve veri işleme uygulamalarından sorumlu değildir. İlgili sitelerde yapılacak işlemler ve bu sitelerin kullanımına ilişkin tüm sorumluluk kullanıcıya aittir. Bu kapsamda, dış bağlantı verilmesi hukuki anlamda "atıfta bulunma" niteliğindedir.
                        </p>
                    </section>
                    
                    <section>
                        <p className="text-xs md:text-sm leading-relaxed mt-8 font-medium">
                            Sitemizde uygulanan gizlilik politikası ve kullanım şartları ile ilgili görüş ve düşünceleriniz için İletişim sayfası aracılığıyla bizimle iletişime geçebilirsiniz.
                        </p>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-4">
                            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')} - Ceylan.m.e
                        </p>
                    </section>
                </div>
            </main>
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default TermsOfService;

