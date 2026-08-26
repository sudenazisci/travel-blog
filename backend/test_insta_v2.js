const { instagramGetUrl } = require("instagram-url-direct");

async function testInsta() {
    const urls = [
        "https://www.instagram.com/reel/DCOAqbXyq8h/",
        "https://www.instagram.com/p/DCOAqbXyq8h/",
        "https://instagram.com/reel/DCOAqbXyq8h"
    ];

    for (const url of urls) {
        console.log("\nTesting URL:", url);
        try {
            const result = await instagramGetUrl(url);
            console.log("Success!");
            console.log("Result Keys:", Object.keys(result));
            if (result.url_list && result.url_list.length > 0) {
                console.log("Video URL:", result.url_list[0]);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    }
}

testInsta();
