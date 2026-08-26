const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Blog = require('./models/Blog');

dotenv.config();

const seedFullContent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog');
        console.log('MongoDB Connected for Seed Full Content');

        // Clear existing data cleanly
        await Destination.deleteMany({});
        await Blog.deleteMany({});

        // 1. Create Regions
        const regionDefs = [
            { name: 'TÜRKİYE', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80', description: 'Türkiye gezileri, antik kentler ve cennet koylar.' },
            { name: 'ASYA', image: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?w=800&auto=format&fit=crop&q=80', description: 'Gizemli doğu kültürü, tapınaklar ve egzotik lezzetler.' },
            { name: 'AVRUPA', image: 'https://images.unsplash.com/photo-1467269204594-9661b133dd2b?w=800&auto=format&fit=crop&q=80', description: 'Tarihi mimari, romantik şehirler ve zengin kültür.' },
            { name: 'AFRİKA', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=80', description: 'Vahşi yaşam safarileri ve mistik çöl seyahatleri.' },
            { name: 'GÜNEY AMERİKA', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&auto=format&fit=crop&q=80', description: 'İnka medeniyeti, Amazon ormanları ve tutkulu şehirler.' },
            { name: 'KUZEY AMERİKA', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=80', description: 'Gökdelenler, kanyonlar ve devasa milli parklar.' }
        ];

        const regionDocs = {};
        for (const reg of regionDefs) {
            const doc = await Destination.create({
                name: reg.name,
                image: reg.image,
                description: reg.description,
                parent: null,
                isRegion: true
            });
            regionDocs[reg.name] = doc;
            console.log(`Region created: ${reg.name}`);
        }

        // 2. Create Sub-destinations under regions
        const subDestDefs = [
            { name: 'Kapadokya', region: 'TÜRKİYE', image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800', lat: 38.6431, lng: 34.8289 },
            { name: 'İstanbul', region: 'TÜRKİYE', image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800', lat: 41.0082, lng: 28.9784 },
            { name: 'Tokyo', region: 'ASYA', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', lat: 35.6762, lng: 139.6503 },
            { name: 'Busan', region: 'ASYA', image: 'https://images.unsplash.com/photo-1538485199774-866413259800?w=800', lat: 35.1796, lng: 129.0756 },
            { name: 'Bali', region: 'ASYA', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', lat: -8.4095, lng: 115.1889 },
            { name: 'Paris', region: 'AVRUPA', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', lat: 48.8566, lng: 2.3522 },
            { name: 'Amalfi', region: 'AVRUPA', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800', lat: 40.6340, lng: 14.6027 },
            { name: 'Marakeş', region: 'AFRİKA', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800', lat: 31.6295, lng: -7.9811 },
            { name: 'Cusco', region: 'GÜNEY AMERİKA', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800', lat: -13.5319, lng: -71.9675 },
            { name: 'New York', region: 'KUZEY AMERİKA', image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e29f122?w=800', lat: 40.7128, lng: -74.0060 }
        ];

        const subDocs = {};
        for (const sub of subDestDefs) {
            const parentReg = regionDocs[sub.region];
            const doc = await Destination.create({
                name: sub.name,
                image: sub.image,
                description: `${sub.name} gezi ve seyahat rehberi.`,
                parent: parentReg._id,
                lat: sub.lat,
                lng: sub.lng,
                isRegion: false
            });
            subDocs[sub.name] = doc;
            console.log(`Sub-destination created: ${sub.name} under ${sub.region}`);
        }

        // 3. Create Blogs for each region
        const blogDefs = [
            {
                title: 'Kapadokya Peri Bacaları ve Sıcak Hava Balon Turu Rehberi',
                slug: 'kapadokya-peri-bacalari-rehberi',
                image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Kapadokya']._id,
                metaTitle: 'Kapadokya Balon Turu ve Gezi Rehberi',
                metaDescription: 'Kapadokya’da gün doğumunda balon turu, Göreme açık hava müzesi ve yeraltı şehirleri rehberi.',
                content: `<p>Kapadokya, dünyada eşi benzeri bulunmayan peri bacaları, büyüleyici yeraltı şehirleri ve sabahın ilk ışıklarıyla gökyüzünü kaplayan yüzlerce sıcak hava balonu ile masalsı bir atmosfer sunuyor.</p><h2>Gezilecek Başlıca Yerler</h2><ul><li><strong>Göreme Açık Hava Müzesi:</strong> Kaya oyma kiliseler ve tarihi freskler.</li><li><strong>Uçhisar Kalesi:</strong> Kapadokya'nın en yüksek noktasından panoramik manzara.</li><li><strong>Derinkuyu Yeraltı Şehri:</strong> Binlerce yıl öncesinin mühendislik harikası.</li></ul>`
            },
            {
                title: 'İstanbul’un Tarihi Sokakları ve Gizli Lezzet Durakları',
                slug: 'istanbul-tarihi-sokaklari-rehberi',
                image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['İstanbul']._id,
                metaTitle: 'İstanbul Gezi ve Lezzet Rehberi',
                metaDescription: 'Tarihi yarımadadan Boğaz kıyılarına İstanbul’un lezzet ve gezi rotaları.',
                content: `<p>İki kıtayı birleştiren kadim şehir İstanbul; Boğaz manzaraları, tarihi yarımadası ve zengin mutfak kültürü ile gezginlere unutulmaz anlar vaat ediyor.</p><h2>Öne Çıkan Rotalar</h2><p>Sultanahmet, Balat sokakları ve Kadıköy çarşısında lezzet keşifleri yapabilirsiniz.</p>`
            },
            {
                title: 'Japonya Sakura Sezonu: Tokyo ve Kyoto Gezi Rehberi',
                slug: 'japonya-sakura-sezonu-tokyo-kyoto',
                image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Tokyo']._id,
                metaTitle: 'Japonya Sakura ve Tokyo Rehberi',
                metaDescription: 'Japonya’da kraz çiçekleri açarken Tokyo ve Kyoto sokaklarında unutulmaz bir seyahat.',
                content: `<p>Japonya’da bahar aylarında pembe ve beyaz sakura çiçeklerinin açmasıyla şehirler masalsı bir bürünüm kazanır.</p><h2>Gezilecek Noktalar</h2><p>Shinjuku Gyoen parkı ve Senso-ji tapınağı listenizde ilk sırada olmalı.</p>`
            },
            {
                title: 'Güney Kore’nin Sahil Cenneti: Busan Gezi Rehberi',
                slug: 'guney-kore-busan-gezi-rehberi',
                image: 'https://images.unsplash.com/photo-1538485199774-866413259800?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Busan']._id,
                metaTitle: 'Busan Gezi Rehberi | Plajlar ve Tapınaklar',
                metaDescription: 'Gamcheon Kültür Köyü, Haedong Yonggungsa Tapınağı ve Haeundae Plajı ile Busan rotası.',
                content: `<p>Busan, Güney Kore’nin ikinci büyük şehri olup muhteşem plajları, deniz kenarındaki tapınakları ve renkli Gamcheon köyü ile büyüleyici bir liman kentidir.</p>`
            },
            {
                title: 'Bali Egzotik Doğa Rehberi: Tapınaklar ve Şelaleler',
                slug: 'bali-egzotik-doga-rehberi',
                image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Bali']._id,
                metaTitle: 'Bali Gezi Rehberi | Tapınaklar ve Doğal Havuzlar',
                metaDescription: 'Ubud pirinç tarlaları, Uluwatu tapınağı ve Bali şelaleleri gezi ipuçları.',
                content: `<p>Bali, yemyeşil doğası, huzurlu spritüal atmosferi ve harika sörf plajları ile Güneydoğu Asya’nın en sevilen adasıdır.</p>`
            },
            {
                title: 'Paris’te 3 Günde Gezilecek En Romantik Rotalar',
                slug: 'paris-3-gunde-gezilecek-yerler',
                image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Paris']._id,
                metaTitle: 'Paris Gezi Rehberi | Eyfel ve Louvre',
                metaDescription: 'Paris seyahatinizde mutlaka görmeniz gereken tarihi meydanlar, müzeler ve romantik kafeler.',
                content: `<p>Aşıklar şehri Paris; Eyfel Kulesi, Louvre Müzesi, Montmartre tepesi ve Sen Nehri kıyısında unutulmaz yürüyüş hatları sunar.</p>`
            },
            {
                title: 'İtalya Amalfi Kıyıları: Positano ve Ravello Seyahati',
                slug: 'italya-amalfi-kiyilari-positano',
                image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Amalfi']._id,
                metaTitle: 'Amalfi Kıyıları Gezi Rehberi | İtalya',
                metaDescription: 'Dik yamaçlara kurulmuş renkli evleri ve büyüleyici Akdeniz manzaralarıyla Amalfi gezisi.',
                content: `<p>Güney İtalya'nın eşsiz kıyı şeridi Amalfi; lezzetli makarnaları, limon bahçeleri ve Positano’nun turkuaz koylarıyla rüya gibi bir tatil rotasıdır.</p>`
            },
            {
                title: 'Fas Marakeş’in Rengarenk Çarşıları ve Çöl Gezisi',
                slug: 'marakes-rengarenk-carsilari-ve-col-gezisi',
                image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Marakeş']._id,
                metaTitle: 'Marakeş Gezi Rehberi | Fas Çöl Rotaları',
                metaDescription: 'Kızıl şehir Marakeş, Jemaa el-Fnaa meydanı ve Sahra Çölü safari deneyimi.',
                content: `<p>Kuzey Afrika’nın en gizemli şehri Marakeş; baharat kokulu dar sokakları, tarihi riad otelleri ve Sahra Çölü gezileriyle gezginleri büyülüyor.</p>`
            },
            {
                title: 'Peru Machu Picchu: İnkaların Büyüleyici Mirası',
                slug: 'peru-machu-picchu-inkalarin-mirasi',
                image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['Cusco']._id,
                metaTitle: 'Machu Picchu Gezi Rehberi | Peru',
                metaDescription: 'And Dağları’nın zirvesinde İpucu kent Machu Picchu ve İnka Vadisi keşfi.',
                content: `<p>Machu Picchu, And Dağları’nın sisli zirvelerinde yükselen antik İnka şehri olarak dünyanın 7 harikasından biridir.</p>`
            },
            {
                title: 'New York Şehir Rehberi: Özgürlük Heykeli’nden Central Park’a',
                slug: 'new-york-sehir-rehberi',
                image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e29f122?w=1200&auto=format&fit=crop&q=80',
                destination: subDocs['New York']._id,
                metaTitle: 'New York Gezi Rehberi | Manhattan ve Brooklyn',
                metaDescription: 'Dünyanın en ikonik metropolü New York’ta gezilecek en popüler cazibe merkezleri.',
                content: `<p>Uyumayan şehir New York; Times Meydanı, Central Park, Broadway tiyatroları ve dünyaca ünlü müzeleriyle nefes kesici bir tempo yaşatıyor.</p>`
            }
        ];

        for (const b of blogDefs) {
            await Blog.create(b);
            console.log(`Blog created: ${b.title}`);
        }

        console.log('🎉 Full Content Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding full content:', err);
        process.exit(1);
    }
};

seedFullContent();
