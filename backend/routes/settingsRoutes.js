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

        // Update all fields dynamically from req.body
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                settings[key] = req.body[key];
            }
        });

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
