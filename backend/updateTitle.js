const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const SiteSettings = require('./models/SiteSettings');

console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            let settings = await SiteSettings.findOne();
            if (!settings) {
                console.log('No settings found, creating new...');
                settings = new SiteSettings({});
            } else {
                console.log('Current Title:', settings.siteTitle);
            }
            settings.siteTitle = 'Ceylan.m.e.';
            await settings.save();
            console.log('Site Title updated to Ceylan.m.e.');
        } catch (err) {
            console.error(err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('Connect Error:', err));
