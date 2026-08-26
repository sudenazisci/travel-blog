const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape() {
    const url = "https://www.instagram.com/reel/DCOAqbXyq8h/";
    console.log("Testing URL:", url);
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
            }
        });

        const $ = cheerio.load(data);
        const videoUrl = $('meta[property="og:video"]').attr('content');
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');

        console.log("Video URL:", videoUrl);
        console.log("Description:", description);

        // Debug: Log title to see if we hit login page
        console.log("Page Title:", $('title').text());

    } catch (error) {
        console.error("Scrape Error:", error.message);
        if (error.response) console.log("Status:", error.response.status);
    }
}

testScrape();
