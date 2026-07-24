const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Destination = require('../models/Destination');

// @route   GET /sitemap.xml
// @desc    Generate dynamic sitemap
// @access  Public
router.get('/sitemap.xml', async (req, res) => {
    try {
        const baseUrl = 'http://localhost:5174'; // Change this to production domain in future
        const blogs = await Blog.find({}, 'slug updatedAt');
        const destinations = await Destination.find({}, '_id name updatedAt');

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms-of-service</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
`;

        // Add Blogs
        blogs.forEach(blog => {
            const url = blog.slug ? `${baseUrl}/blog/${blog.slug}` : `${baseUrl}/blog/${blog._id}`;
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
        <loc>${baseUrl}/destinations/${dest._id}</loc>
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
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
