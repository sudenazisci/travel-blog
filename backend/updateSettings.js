const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const updateSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings();
        }

        settings.youtubePreviewImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png';

        await settings.save();
        console.log('Settings updated successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateSettings();
