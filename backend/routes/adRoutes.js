const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Ad = require('../models/Ad');

// @route   GET api/ads
// @desc    Get active ads (or all ads if query all=true for admin)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { active: true };
        if (req.query.location) {
            query.location = req.query.location;
        }
        const ads = await Ad.find(query).sort({ createdAt: -1 });
        res.json(ads);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/ads
// @desc    Create an ad
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, location, type, imageUrl, link, code, active } = req.body;

    try {
        const newAd = new Ad({
            title: title || 'Reklam Banner',
            location: location || 'sidebar',
            type: type || 'image',
            imageUrl: imageUrl || '',
            link: link || '',
            code: code || '',
            active: active !== undefined ? active : true
        });

        const ad = await newAd.save();
        res.json(ad);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/ads/:id
// @desc    Update an ad
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, location, type, imageUrl, link, code, active } = req.body;

    try {
        let ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ msg: 'Ad not found' });
        }

        if (title !== undefined) ad.title = title;
        if (location !== undefined) ad.location = location;
        if (type !== undefined) ad.type = type;
        if (imageUrl !== undefined) ad.imageUrl = imageUrl;
        if (link !== undefined) ad.link = link;
        if (code !== undefined) ad.code = code;
        if (active !== undefined) ad.active = active;

        await ad.save();
        res.json(ad);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PATCH api/ads/:id/toggle
// @desc    Toggle ad active state
// @access  Private
router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        let ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ msg: 'Ad not found' });
        }
        ad.active = !ad.active;
        await ad.save();
        res.json(ad);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/ads/:id
// @desc    Delete an ad
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);

        if (!ad) {
            return res.status(404).json({ msg: 'Ad not found' });
        }

        res.json({ msg: 'Ad removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

