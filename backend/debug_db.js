const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');
// Register other models for populate
require('./models/Destination');
require('./models/Blog');
// require('./models/Region');
const dotenv = require('dotenv');

dotenv.config();

console.log('Starting DB Debug Script...');
console.log('URI:', process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog')
    .then(async () => {
        console.log('MongoDB Connected');
        try {
            console.log('Querying SiteSettings...');
            let settings = await SiteSettings.findOne().populate({
                path: 'featuredBlogs',
                populate: {
                    path: 'destination',
                    populate: { path: 'parent' }
                }
            });
            console.log('Query Result:', settings ? 'Found Settings' : 'No Settings');

            if (!settings) {
                console.log('Creating new settings...');
                settings = new SiteSettings();
                await settings.save();
                console.log('Settings created.');
            } else {
                console.log('Found:', JSON.stringify(settings, null, 2));
            }
            process.exit(0);
        } catch (err) {
            console.error('Query Error:', err);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Connection Error:', err);
        process.exit(1);
    });
