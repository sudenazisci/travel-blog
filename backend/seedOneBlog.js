const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Blog = require('./models/Blog');

dotenv.config();

const seedOneBlog = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog');
        console.log('MongoDB Connected for Seeding 1 Master Blog Post...');

        // Clear existing blogs
        await Blog.deleteMany({});

        // Ensure Türkiye Region exists
        let region = await Destination.findOne({ isRegion: true, name: 'TÜRKİYE' });
        if (!region) {
            region = await Destination.create({
                name: 'TÜRKİYE',
                image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
                description: 'Türkiye gezileri, antik kentler ve cennet koylar.',
                isRegion: true
            });
        }

        // Find or create Kapadokya destination
        let dest = await Destination.findOne({ name: 'Kapadokya' });
        if (!dest) {
            dest = await Destination.create({
                name: 'Kapadokya',
                image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=800',
                description: 'Peri bacaları, sıcak hava balonları ve büyülü vadiler.',
                parent: region._id,
                lat: 38.6431,
                lng: 34.8289,
                isRegion: false
            });
        }

        // Create 1 comprehensive master blog post
        const masterBlog = await Blog.create({
            title: 'Kapadokya Peri Bacaları ve Sıcak Hava Balon Turu Rehberi',
            slug: 'kapadokya-peri-bacalari-ve-balon-turu-rehberi',
            image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=1600&auto=format&fit=crop&q=80',
            imagePosition: '50%',
            destination: dest._id,
            metaTitle: 'Kapadokya Balon Turu ve Detaylı Gezi Rehberi — Ceylan.m.e',
            metaDescription: 'Kapadokya’da gün doğumunda sıcak hava balon turu, Göreme açık hava müzesi, yeraltı şehirleri ve vadi yürüyüş hatları.',
            content: `
<p>Kapadokya, dünyada eşi benzeri bulunmayan peri bacaları, büyüleyici yeraltı şehirleri ve sabahın ilk ışıklarıyla gökyüzünü kaplayan yüzlerce sıcak hava balonu ile ziyaretçilerine masalsı bir atmosfer sunuyor. İç Anadolu'nun kalbinde yer alan bu kadim coğrafya, doğanın ve insan elinin yüzyıllar süren ortak sanat eseridir.</p>

<h2>1. Kapadokya'da Gezilecek Başlıca Rotalar</h2>
<p>Kapadokya seyahatinizde mutlaka görmeniz gereken en popüler ve etkileyici noktalar:</p>
<ul>
    <li><strong>Göreme Açık Hava Müzesi:</strong> Kaya oyması kiliseler, manastırlar ve 10. yüzyıldan kalma büyüleyici freskler.</li>
    <li><strong>Uçhisar Kalesi:</strong> Bölgenin en yüksek noktası olup gün batımında tüm vadileri kuşbakışı izleme fırsatı sunar.</li>
    <li><strong>Derinkuyu ve Kaymaklı Yeraltı Şehirleri:</strong> Binlerce yıl önce inşa edilen, havalandırma bacalarından erzak depolarına kadar mühendislik harikası yeraltı yerleşimleri.</li>
    <li><strong>Aşk Vadisi & Paşabağ:</strong> Mantar formundaki devasa peri bacalarının en yoğun ve fotojenik olduğu vadiler.</li>
</ul>

<h2>2. Sıcak Hava Balon Turu Deneyimi ve İpuçları</h2>
<p>Gün doğarken süzülen balonlardan Kapadokya vadilerini izlemek, yaşam boyu unutulmayacak bir deneyimdir. Balon turu planlarken dikkat etmeniz gerekenler:</p>
<ol>
    <li>Erken rezervasyon yapın; özellikle bahar ve sonbahar aylarında yoğun talep olmaktadır.</li>
    <li>Rüzgar durumuna göre uçuşlar sivil havacılık tarafından onaylanır, bu nedenle seyahatinizin ilk sabahına randevu almanız olası ertelemeler için avantaj sağlar.</li>
    <li>Sabahın ilk saatlerinde vadiler serin olduğu için yanınızda kalın giysiler bulundurun.</li>
</ol>

<h2>3. Yeme & İçme ve Konaklama Tavsiyeleri</h2>
<p>Kapadokya'da geleneksel testi kebabı lezzetlerini tadabilir, mağara (cave) konseptli butik otellerde konaklayarak otantik atmosferin tadını çıkarabilirsiniz.</p>
            `,
            views: 142
        });

        console.log(`✅ Seeded 1 Master Blog Post Successfully: ${masterBlog.title}`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding 1 blog post:', err);
        process.exit(1);
    }
};

seedOneBlog();
