const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Ad = require('../models/Ad');

// @route   GET api/ads
// @desc    Get all active ads
// @access  Public
router.get('/', async (req, res) => {
    try {
        const ads = await Ad.find({ active: true });
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
    const { title, imageUrl, link } = req.body;

    try {
        const newAd = new Ad({
            title,
            imageUrl,
            link
        });

        const ad = await newAd.save();
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
