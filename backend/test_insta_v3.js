const InstaClass = require("instagram-url-downloader").default;

async function testInsta() {
    const url = "https://www.instagram.com/reel/DCOAqbXyq8h/";
    console.log("Testing URL:", url);
    try {
        const downloader = new InstaClass(url);

        console.log("downloader:", downloader);

        // Try accessing asyncData as property
        console.log("Accessing asyncData as property...");
        const dataProp = await downloader.asyncData;
        console.log("asyncData Result:", dataProp);

        // Try calling getData if it converts
        if (typeof downloader.getData === 'function') {
            console.log("Calling getData()...");
            const data = await downloader.getData();
            console.log("getData Result:", data);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testInsta();
