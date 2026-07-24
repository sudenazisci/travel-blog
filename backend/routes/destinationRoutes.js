const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// GET All
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST New
router.post('/', async (req, res) => {
    const destination = new Destination({
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng,
        parent: req.body.parent || null,
        isRegion: req.body.isRegion || false,
        isFeatured: req.body.isFeatured || false
    });

    try {
        const newDestination = await destination.save();
        res.status(201).json(newDestination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT Update
router.put('/:id', async (req, res) => {
    try {
        const updatedDestination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedDestination);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted Destination' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
