const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const SiteSettings = require('../models/SiteSettings');

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
        // Filter out null/deleted blog references if any
        if (Array.isArray(settings.featuredBlogs)) {
            settings.featuredBlogs = settings.featuredBlogs.filter(Boolean);
        }
        res.json(settings);
    } catch (err) {
        console.error('Settings Route Error:', err);
        res.status(500).send('Server Error');
    }
});

// UPDATE Settings
router.put('/', auth, async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings();
        }

        // Update fields from req.body (korunan alanlar hariç)
        const PROTECTED = ['_id', '__v', 'totalVisitors', 'overall'];
        Object.keys(req.body).forEach(key => {
            if (PROTECTED.includes(key) || key.startsWith('$')) return;
            if (req.body[key] !== undefined && SiteSettings.schema.path(key)) {
                settings[key] = req.body[key];
            }
        });

        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ESKİ SAYAÇ: Artık yazma yapmaz. Gerçek ziyaretçi takibi /api/stats/track ile yapılır.
// (Eski sürüm istemcileri hata almasın diye uç korundu.)
router.post('/visit', (req, res) => {
    res.json({ ok: true });
});

module.exports = router;
