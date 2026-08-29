const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
    overall: {
        type: String,
        default: 'settings' // Singleton pattern ensure only one doc
    },
    heroTitle: { type: String, default: 'Discover Your Next Great Adventure' },
    heroSubtitle: { type: String, default: 'Curated travel guides, hidden gems, and inspiring stories from explorers around the globe.' },
    heroImage: { type: String, default: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' },
    siteTitle: { type: String, default: 'Ceylan.m.e.' },
    destinationsTag: { type: String, default: 'Most Popular' },
    visitedCount: { type: Number, default: 12 }, // Keeping for backwards compat or until full removal
    mileCount: { type: String, default: '850K+' }, // default string or number? User said 850k+. A string is more flexible for "850K+"
    countryCount: { type: Number, default: 0 },
    cityCount: { type: Number, default: 0 },
    announcement: { type: String, default: 'Yakında Norveç Seyehatı Yayında!' }, // Announcement marquee
    homepageQuote: { type: String, default: 'The world is a book and those who do not travel read only one page.' },
    homepageQuoteAuthor: { type: String, default: 'St. Augustine' },
    instagramPostUrl: { type: String, default: 'https://instagram.com' },
    instagramPreviewImage: { type: String, default: '' },
    instagramPostCount: { type: String, default: '443' },
    instagramFollowerCount: { type: String, default: '102 B' },
    instagramFollowingCount: { type: String, default: '405' },
    youtubeUrl: { type: String, default: 'https://www.youtube.com/@Ceylan.m.e' },
    youtubeSubscriberCount: { type: String, default: '10 B' },
    youtubeProfileImage: { type: String, default: 'https://yt3.googleusercontent.com/CMAt08ekDEnbi5aKkt_MWswslIXeo0LYl85vRSFU89q8UpuKtXk_8OYaslkqNwtkc66IY9l8Puo=s900-c-k-c0x00ffffff-no-rj' },
    youtubePreviewImage: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png' }, // YouTube Logo
    googleAdSenseId: { type: String, default: '' }, // e.g. ca-pub-XXXXXXXXXXXXXXXX
    totalVisitors: { type: Number, default: 0 },
    aboutTitle: { type: String, default: 'Dünyayı Keşfetmek, Anılar Biriktirmek ve İlham Vermek İçin Yoldayız.' },
    aboutSubtitle: { type: String, default: 'Bilinmeyen rotaların heyecanı, antik sokakların fısıltısı ve farklı kültürlerin sıcaklığı... Ceylan.m.e, seyahat tutkusunu yaşayan herkes için ilham dolu bir pusula.' },
    aboutStoryTitle: { type: String, default: 'Bir Sırt Çantası ve Sonsuz Bir Merakla Başlayan Serüven' },
    aboutStoryContent: { type: String, default: 'Ceylan.m.e, dünyayı yalnızca harita üzerinden izlemek yerine ona dokunmak, sokaklarında kaybolmak ve yerel insanların gözünden yaşamı anlamak tutkusuyla doğdu. Tokyo’nun neon ışıklı sokaklarından Kapadokya’nın masalsı vadilerine, Amalfi’nin dik kıyılarından Marakeş’in baharat kokulu çarşılarına uzanan bu yolculukta amacımız; her gezginin kendi rüya seyahatini en doğru, pratik ve samimi bilgilerle planlamasını sağlamak.' },
    aboutImage: { type: String, default: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1000&auto=format&fit=crop&q=80' },
    aboutStatsCountries: { type: String, default: '25+' },
    aboutStatsCountriesLabel: { type: String, default: 'Keşfedilen Ülke' },
    aboutStatsCities: { type: String, default: '100+' },
    aboutStatsCitiesLabel: { type: String, default: 'Şehir Rehberi' },
    aboutStatsCommunity: { type: String, default: '100K+' },
    aboutStatsCommunityLabel: { type: String, default: 'Gezgin Topluluğu' },
    aboutStatsGuides: { type: String, default: '500+' },
    aboutStatsGuidesLabel: { type: String, default: 'Fotoğraf & İpucu' },
    mapVisitedCountryCount: { type: String, default: '60' },
    featuredBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }], // Keeping for backward compatibility or alternative use
    heroSlides: [{
        image: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        link: { type: String, default: '' },
        textColor: { type: String, default: '#ffffff' }, // Default white
        imagePosition: { type: String, default: 'center' } // e.g., 'top', 'bottom', '50% 50%'
    }]
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
