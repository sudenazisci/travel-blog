const axios = require('axios');
const cheerio = require('cheerio');

const scrapeInstagramStats = async (profileUrl) => {
    try {
        if (!profileUrl.includes('instagram.com/')) {
            throw new Error('Invalid Instagram URL');
        }

        // Add headers to mimic a browser request to avoid immediate blocking
        const { data } = await axios.get(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);

        // Instagram stores metadata in <meta property="og:description">
        // Format roughly: "102K Followers, 443 Following, 2,000 Posts - See Instagram photos and videos from..."
        const metaContent = $('meta[property="og:description"]').attr('content');

        if (!metaContent) {
            throw new Error('Could not find meta description');
        }

        // Extract numbers using basic string splitting
        // Example content: "102K Followers, 443 Following, 443 Posts"
        const stats = metaContent.split(' - ')[0]; // Remove "- See Instagram..."
        const parts = stats.split(', ');

        let followers = '0';
        let following = '0';
        let posts = '0';

        // More robust parsing loop
        parts.forEach(part => {
            if (part.includes('Followers')) followers = part.replace(' Followers', '');
            if (part.includes('Following')) following = part.replace(' Following', '');
            if (part.includes('Posts')) posts = part.replace(' Posts', '');
        });

        return {
            followers,
            following,
            posts
        };

    } catch (error) {
        console.error('Instagram Scrape Error:', error.message);
        throw error;
    }
};

module.exports = scrapeInstagramStats;
