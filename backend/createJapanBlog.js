const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');
const Destination = require('./models/Destination');
const SiteSettings = require('./models/SiteSettings');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog')
    .then(async () => {
        console.log('MongoDB Connected');

        // 1. Ensure Destination 'Japonya' exists
        let japan = await Destination.findOne({ name: 'Japonya' });
        if (!japan) {
            japan = await Destination.create({
                name: 'Japonya',
                image: '/uploads/japan_hero.png', // Reusing same image or placeholder
                description: 'Uzak Doğu\'nun büyüleyici ülkesi.'
            });
            console.log('Created Destination: Japonya');
        }

        let tokyo = await Destination.findOne({ name: 'Tokyo' });
        if (!tokyo) {
            tokyo = await Destination.create({
                name: 'Tokyo',
                image: '/uploads/japan_hero.png',
                parent: japan._id,
                description: 'Japonya\'nın başkenti.'
            });
            console.log('Created Destination: Tokyo');
        }

        // 2. Create Blog Post
        const blogData = {
            title: "Japonya'ya Gitsek mi?",
            content: `
                <p><strong>Japonya</strong>, geleneksel kültürün modern teknolojiyle harmanlandığı eşsiz bir diyar. Tapınaklardan gökdelenlere, suşiden ramen'e kadar her şey burada bir sanat eseri.</p>
                <p>Bu yazıda Tokyo sokaklarında kaybolacağız, Kyoto'nun tapınaklarında huzur bulacağız ve Osaka'da lezzet turuna çıkacağız.</p>
                <h3>Neden Gitmeli?</h3>
                <ul>
                    <li>Eşsiz Kültür</li>
                    <li>Muazzam Yemekler</li>
                    <li>Güvenli ve Temiz Şehirler</li>
                </ul>
                <p>Hazırsanız, biletleri almaya başlayalım!</p>
            `,
            image: '/uploads/japan_hero.png', // The uploaded image path
            destination: tokyo._id,
            slug: 'japonya-ya-gitsek-mi',
            metaDescription: "Japonya'nın gizemli sokaklarında kimono ile bir gezintiye ne dersiniz?"
        };

        // Check if blog already exists to avoid duplicates
        let blog = await Blog.findOne({ title: blogData.title });
        if (blog) {
            // Update existing
            blog.image = blogData.image;
            blog.content = blogData.content;
            blog.destination = blogData.destination;
            await blog.save();
            console.log('Updated existing Blog');
        } else {
            blog = await Blog.create(blogData);
            console.log('Created new Blog');
        }

        // 3. Update SiteSettings to Feature this Blog
        let settings = await SiteSettings.findOne();
        if (!settings) settings = new SiteSettings();

        // Remove if already in list to avoid duplicates
        let currentFeatured = settings.featuredBlogs || [];
        currentFeatured = currentFeatured.filter(id => id.toString() !== blog._id.toString());

        // Add to BEGINNING of array
        currentFeatured.unshift(blog._id);

        // Trim to max 3
        if (currentFeatured.length > 3) {
            currentFeatured = currentFeatured.slice(0, 3);
        }

        settings.featuredBlogs = currentFeatured;
        await settings.save();
        console.log('Updated Site Settings with new Featured Blog');

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
