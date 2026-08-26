const instagramSave = require("instagram-save");

async function testInsta() {
    const url = "https://www.instagram.com/reel/DCOAqbXyq8h/";
    console.log("Testing URL:", url);
    try {
        const result = await instagramSave(url, 'temp_video_folder');
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}

testInsta();
