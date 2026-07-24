const https = require('https');
https.get('https://www.youtube.com/@Ceylan.m.e', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const match = data.match(/<meta property="og:image" content="(.*?)"/);
        console.log(match ? match[1] : 'not found');
    });
});
