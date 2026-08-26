const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        enum: ['header', 'sidebar', 'in_post', 'footer'],
        default: 'sidebar'
    },
    type: {
        type: String,
        enum: ['image', 'code'],
        default: 'image'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Ad', AdSchema);

