const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    description: {
        type: String
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        default: null
    },
    isRegion: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Destination', DestinationSchema);
