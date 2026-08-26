import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Megaphone, ShieldCheck, Award, HelpCircle } from 'lucide-react';

const AdvertisingPolicy = () => {
    return (
        <div className="bg-[#faf8f5] min-h-screen flex flex-col justify-between font-sans text-stone-800">
            <SEO 
                title="Reklam ve İş Birliği Politikası - Ceylan.m.e"
                description="Ceylan.m.e seyahat blogu reklam ilkeleri, sponsorlu içerik şeffaflığı ve Google AdSense standartları."
            />
            <Navbar />

            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                {/* Header */}
                <div className="border-b border-[#e8e4dc] pb-8 mb-10">
                    <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#c25e36] uppercase block mb-2">
                        ŞEFFAFLIK VE YASAL BİLGİLENDİRME
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1c1917] font-medium tracking-tight mb-4">
                        Reklam ve İş Birliği Politikası
                    </h1>
                    <p className="text-stone-500 font-mono text-xs">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-10 text-stone-700 font-light leading-relaxed text-sm md:text-base">
                    
                    {/* Section 1 */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ede8e1] shadow-xs">
                        <div className="flex items-center gap-3 mb-4 text-[#c25e36]">
                            <Award size={20} />
                            <h2 className="font-serif text-xl text-[#1c1917] font-medium">
                                1. Editöryal Bağımsızlık ve Dürüstlük İlkesi
                            </h2>
                        </div>
                        <p>
                            Ceylan.m.e üzerinde paylaşılan tüm gezi rehberleri, otel önerileri ve seyahat tavsiyeleri samimi ve tarafsız deneyimlere dayanır. Bir marka veya turizm kuruluşu ile sponsorlu iş birliği yapıldığında dahi, okuyucularımıza sunduğumuz değerlendirmelerin dürüstlüğü ve tarafsızlığı hiçbir koşulda değişmez.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ede8e1] shadow-xs">
                        <div className="flex items-center gap-3 mb-4 text-[#c25e36]">
                            <Megaphone size={20} />
                            <h2 className="font-serif text-xl text-[#1c1917] font-medium">
                                2. Sponsorlu İçerikler ve Etiketleme
                            </h2>
                        </div>
                        <p className="mb-3">
                            Sponsorlu yazılar, ürün incelemeleri veya davet/iş birliği kapsamındaki geziler; açık, net ve şeffaf biçimde etiketlenir. Okuyucunun reklam ile organik içeriği ayırt edebilmesi temel prensibimizdir.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-stone-600 text-xs sm:text-sm">
                            <li>Sponsorlu makalelerde <strong>"Sponsorlu İçerik"</strong> veya <strong>"İş Birliği"</strong> ibaresi yer alır.</li>
                            <li>Tavsiye edilen hiçbir hizmet veya ürün, bizzat beğenilmediği veya güvenilmediği takdirde sitede önerilmez.</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ede8e1] shadow-xs">
                        <div className="flex items-center gap-3 mb-4 text-[#c25e36]">
                            <ShieldCheck size={20} />
                            <h2 className="font-serif text-xl text-[#1c1917] font-medium">
                                3. Google AdSense ve Programatik Reklamlar
                            </h2>
                        </div>
                        <p className="mb-3">
                            Sitemizde Google AdSense ve yetkili reklam ağları üzerinden görüntülü reklamlar yayınlanabilir. Bu reklamlar üçüncü taraf çerezler ve ilgi alanına dayalı pazarlama teknolojileri kullanabilir.
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600">
                            Kullanıcılarımız, çerez tercihlerini sitemizin alt kısmında yer alan <Link to="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('open_cookie_preferences')); }} className="text-[#c25e36] underline font-medium">Çerez Tercihleri</Link> panelinden diledikleri an değiştirebilir veya kişiselleştirilmiş reklamları kapatabilirler.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ede8e1] shadow-xs">
                        <div className="flex items-center gap-3 mb-4 text-[#c25e36]">
                            <HelpCircle size={20} />
                            <h2 className="font-serif text-xl text-[#1c1917] font-medium">
                                4. İletişim ve İş Birliği Talepleri
                            </h2>
                        </div>
                        <p className="mb-4">
                            Turizm otoriteleri, butik oteller, havayolu şirketleri ve seyahat markaları ile gerçekleştirilecek basın bültenleri, rota tanıtımları ve reklam iş birlikleri için <Link to="/contact" className="text-[#c25e36] underline font-medium">İletişim Sayfamız</Link> üzerinden bize ulaşabilirsiniz.
                        </p>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdvertisingPolicy;
