const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Destination = require('../models/Destination');
const path = require('path');
const fs = require('fs');

// @route   GET /sitemap.xml
// @desc    Generate dynamic sitemap XML for SEO crawlers
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const blogs = await Blog.find({}, '_id slug updatedAt');
        const destinations = await Destination.find({}, '_id name updatedAt');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/destinations</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${baseUrl}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookie-policy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/advertising-policy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
`;

        // Add Blogs
        blogs.forEach(blog => {
            const url = `${baseUrl}/blog/${blog._id}`;
            const date = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date().toISOString();
            xml += `    <url>
        <loc>${url}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
`;
        });

        // Add Destinations
        destinations.forEach(dest => {
            const date = dest.updatedAt ? new Date(dest.updatedAt).toISOString() : new Date().toISOString();
            xml += `    <url>
        <loc>${baseUrl}/destination/${dest._id}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
`;
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (err) {
        console.error('Sitemap Error:', err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /ads.txt
// @desc    Serve Google AdSense ads.txt file
// @access  Public
router.get('/ads.txt', (req, res) => {
    const adsTxtPath = path.join(__dirname, '../../frontend/public/ads.txt');
    if (fs.existsSync(adsTxtPath)) {
        res.header('Content-Type', 'text/plain');
        res.sendFile(adsTxtPath);
    } else {
        res.header('Content-Type', 'text/plain');
        res.send('google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0\n');
    }
});

module.exports = router;
