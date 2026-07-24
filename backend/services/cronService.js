const cron = require('node-cron');
const SiteSettings = require('../models/SiteSettings');
const scrapeInstagramStats = require('../utils/instagramScraper');

const startCronJobs = () => {
    console.log('Cron Jobs Initialized');

    // Schedule task for midnight every day (0 0 * * *)
    // For testing you can use '* * * * *' (every minute)
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily Instagram stats update...');

        try {
            const settings = await SiteSettings.findOne({ overall: 'settings' });

            if (!settings || !settings.instagramPostUrl) {
                console.log('No Instagram URL found in settings.');
                return;
            }

            const stats = await scrapeInstagramStats(settings.instagramPostUrl);

            if (stats) {
                settings.instagramFollowerCount = stats.followers;
                settings.instagramFollowingCount = stats.following;
                settings.instagramPostCount = stats.posts;

                await settings.save();
                console.log('Instagram stats updated successfully:', stats);
            }

        } catch (error) {
            console.error('Daily Instagram Update Failed:', error.message);
        }
    });
};

module.exports = startCronJobs;
