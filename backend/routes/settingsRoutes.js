const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
// Middleware to verify token would go here if we had it exported, 
// strictly simplified for now we trust the client or duplicate middleware logic if needed.
// For robust app, importing auth middleware is recommended. 

// GET Settings
router.get('/', async (req, res) => {
    console.log('GET /api/settings request received');
    try {
        let settings = await SiteSettings.findOne().populate({
            path: 'featuredBlogs',
            populate: {
                path: 'destination',
                populate: { path: 'parent' }
            }
        });
        if (!settings) {
            settings = new SiteSettings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        console.error('Settings Route Error:', err);
        res.status(500).send('Server Error');
    }
});

// UPDATE Settings
router.put('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings();
        }

        // Update all fields
        if (req.body.heroTitle !== undefined) settings.heroTitle = req.body.heroTitle;
        if (req.body.heroSubtitle !== undefined) settings.heroSubtitle = req.body.heroSubtitle;
        if (req.body.heroImage !== undefined) settings.heroImage = req.body.heroImage;
        if (req.body.siteTitle !== undefined) settings.siteTitle = req.body.siteTitle;
        if (req.body.destinationsTag !== undefined) settings.destinationsTag = req.body.destinationsTag;
        if (req.body.visitedCount !== undefined) settings.visitedCount = req.body.visitedCount;
        if (req.body.mileCount !== undefined) settings.mileCount = req.body.mileCount;
        if (req.body.countryCount !== undefined) settings.countryCount = req.body.countryCount;
        if (req.body.cityCount !== undefined) settings.cityCount = req.body.cityCount;
        if (req.body.announcement !== undefined) settings.announcement = req.body.announcement;
        if (req.body.homepageQuote !== undefined) settings.homepageQuote = req.body.homepageQuote;
        if (req.body.homepageQuoteAuthor !== undefined) settings.homepageQuoteAuthor = req.body.homepageQuoteAuthor;
        if (req.body.instagramPostUrl !== undefined) settings.instagramPostUrl = req.body.instagramPostUrl;
        if (req.body.instagramPreviewImage !== undefined) settings.instagramPreviewImage = req.body.instagramPreviewImage;
        if (req.body.instagramPostCount !== undefined) settings.instagramPostCount = req.body.instagramPostCount;
        if (req.body.instagramFollowerCount !== undefined) settings.instagramFollowerCount = req.body.instagramFollowerCount;
        if (req.body.instagramFollowingCount !== undefined) settings.instagramFollowingCount = req.body.instagramFollowingCount;
        if (req.body.youtubeUrl !== undefined) settings.youtubeUrl = req.body.youtubeUrl;
        if (req.body.youtubeSubscriberCount !== undefined) settings.youtubeSubscriberCount = req.body.youtubeSubscriberCount;
        if (req.body.youtubeProfileImage !== undefined) settings.youtubeProfileImage = req.body.youtubeProfileImage;
        if (req.body.youtubePreviewImage !== undefined) settings.youtubePreviewImage = req.body.youtubePreviewImage;
        if (req.body.featuredBlogs !== undefined) settings.featuredBlogs = req.body.featuredBlogs;
        if (req.body.heroSlides !== undefined) settings.heroSlides = req.body.heroSlides;
        if (req.body.featuredBlogs !== undefined) settings.featuredBlogs = req.body.featuredBlogs;

        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// INCREASE Total Visitors
router.post('/visit', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings();
        }

        settings.totalVisitors = (settings.totalVisitors || 0) + 1;
        await settings.save();

        res.json({ totalVisitors: settings.totalVisitors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
