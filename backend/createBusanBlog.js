const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');
const Destination = require('./models/Destination');
const SiteSettings = require('./models/SiteSettings');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog')
    .then(async () => {
        console.log('MongoDB Connected');

        // 1. Find Region 'ASYA'
        let asya = await Destination.findOne({ name: 'ASYA' });
        if (!asya) {
            console.log('Region ASYA not found, creating...');
            asya = await Destination.create({
                name: 'ASYA',
                image: 'https://images.unsplash.com/photo-1535139262971-c51845709a48',
                description: 'ASYA bölgesi için seyahat rehberi.',
                isRegion: true
            });
        }

        // 2. Ensure Destination 'GÜNEY KORE' exists
        let korea = await Destination.findOne({ name: 'GÜNEY KORE' });
        if (!korea) {
            korea = await Destination.create({
                name: 'GÜNEY KORE',
                image: '/uploads/busan_hero.png',
                description: 'Gelenek ve teknolojinin buluşma noktası.',
                parent: asya._id
            });
            console.log('Created Destination: GÜNEY KORE');
        }

        // 3. Ensure Destination 'BUSAN' exists
        let busan = await Destination.findOne({ name: 'BUSAN' });
        if (!busan) {
            busan = await Destination.create({
                name: 'BUSAN',
                image: '/uploads/busan_hero.png',
                parent: korea._id,
                description: 'Güney Kore\'nin sahil incisi.'
            });
            console.log('Created Destination: BUSAN');
        }

        // 4. Create Blog Post
        const blogData = {
            title: "Güney Kore, Busan'a Gitsek mi?",
            content: `
                <p><strong>Busan</strong>, Güney Kore'nin en büyük ikinci şehri ve en önemli liman kenti. Renkli Gamcheon Kültür Köyü'nden Haeundae Plajı'na kadar eşsiz manzaralar sunuyor.</p>
                <p>Busan'da deniz ürünlerinin tadına bakabilir, tapınakları ziyaret edebilir ve modern şehir hayatının keyfini çıkarabilirsiniz.</p>
                <h3>Gezilecek Yerler</h3>
                <ul>
                    <li>Gamcheon Kültür Köyü</li>
                    <li>Haeundae Plajı</li>
                    <li>Haedong Yonggungsa Tapınağı</li>
                </ul>
                <p>Güney Kore gezinizde Busan'ı mutlaka listenize ekleyin!</p>
            `,
            image: '/uploads/busan_hero.png',
            destination: busan._id,
            slug: 'guney-kore-busan-a-gitsek-mi',
            metaDescription: "Güney Kore'nin renkli liman kenti Busan'da unutulmaz bir geziye hazır mısınız?"
        };

        let blog = await Blog.findOne({ title: blogData.title });
        if (blog) {
            blog.image = blogData.image;
            blog.content = blogData.content;
            blog.destination = blogData.destination;
            await blog.save();
            console.log('Updated existing Blog');
        } else {
            blog = await Blog.create(blogData);
            console.log('Created new Blog');
        }

        // 5. Update SiteSettings to Feature this Blog and Add to Hero Slides
        let settings = await SiteSettings.findOne();
        if (!settings) settings = new SiteSettings();

        // Add to Featured Blogs (Latest Posts)
        let currentFeatured = settings.featuredBlogs || [];
        // Ensure not duplicate
        currentFeatured = currentFeatured.filter(id => id.toString() !== blog._id.toString());
        currentFeatured.unshift(blog._id);
        if (currentFeatured.length > 3) currentFeatured = currentFeatured.slice(0, 3);
        settings.featuredBlogs = currentFeatured;

        // Add to Custom Hero Slides
        // We want this specific slide to be there
        const newSlide = {
            image: '/uploads/busan_hero.png',
            title: "Güney Kore, Busan'a Gitsek mi?",
            subtitle: "Renkli evleri ve eşsiz sahilleriyle büyüleyen şehir.",
            link: `/blog/${blog._id}`
        };

        // Check if this specific slide exists (by link)
        let heroSlides = settings.heroSlides || [];
        const existingSlideIndex = heroSlides.findIndex(s => s.link === newSlide.link);
        if (existingSlideIndex > -1) {
            heroSlides[existingSlideIndex] = newSlide;
        } else {
            heroSlides.unshift(newSlide);
        }

        // Limit to 3 slides
        if (heroSlides.length > 3) heroSlides = heroSlides.slice(0, 3);

        settings.heroSlides = heroSlides;

        await settings.save();
        console.log('Updated Site Settings with new Featured Blog and Hero Slide');

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
