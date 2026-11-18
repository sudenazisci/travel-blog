const cron = require('node-cron');
const SiteSettings = require('../models/SiteSettings');
const scrapeInstagramStats = require('../utils/instagramScraper');
const { createClient } = require('@supabase/supabase-js');

const startCronJobs = () => {
    console.log('Cron Jobs Initialized');

    // Supabase Keep-Alive Job (Her gün saat 03:00'da çalışır)
    // Supabase Free Tier 7 gün inaktiflikte projeyi dondurur. Bu ping ile asla donmaz.
    cron.schedule('0 3 * * *', async () => {
        try {
            const supabaseUrl = process.env.SUPABASE_URL;
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey, {
                    auth: { persistSession: false, autoRefreshToken: false }
                });
                const { data, error } = await supabase.storage.from('blog-images').list('posts', { limit: 1 });
                if (error) {
                    console.warn('[KeepAlive] Supabase ping uyarısı:', error.message);
                } else {
                    console.log('[KeepAlive] Supabase başarıyla pinglendi (inaktivite önlendi).');
                }
            }
        } catch (err) {
            console.error('[KeepAlive] Supabase ping hatası:', err.message);
        }
    });

    // Schedule task for midnight every day (0 0 * * *)
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
