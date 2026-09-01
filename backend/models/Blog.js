const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // default image if none provided
        default: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    },
    imagePosition: {
        type: String,
        default: 'center' // e.g. 'top', 'bottom', '50% 50%'
    },
    slug: {
        type: String,
        unique: true
    },
    metaTitle: String,
    metaDescription: String,
    category: String,
    country: String,
    city: String,
    travelDate: String,
    isDraft: {
        type: Boolean,
        default: false
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Blog', BlogSchema);
