const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const KEY_FILE_PATH = path.join(__dirname, '..', 'config', 'service-account.json');
const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

const getTargetSite = async (authClient) => {
    const searchConsole = google.searchconsole({ version: 'v1', auth: authClient });
    const res = await searchConsole.sites.list();
    const sites = res.data.siteEntry;
    if (sites && sites.length > 0) {
        return sites[0].siteUrl; // Default to first site
    }
    return null;
};

const getTopKeywords = async () => {
    try {
        if (!fs.existsSync(KEY_FILE_PATH)) {
            console.warn("Service account file not found at:", KEY_FILE_PATH);
            return [];
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE_PATH,
            scopes: SCOPES,
        });

        const authClient = await auth.getClient();
        const siteUrl = await getTargetSite(authClient);

        if (!siteUrl) {
            console.warn("No sites found in Search Console.");
            return [];
        }

        const searchConsole = google.searchconsole({ version: 'v1', auth: authClient });

        // Fetch last 30 days data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const res = await searchConsole.searchanalytics.query({
            siteUrl,
            requestBody: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                dimensions: ['query'],
                rowLimit: 10,  // Get top 10 keywords
                aggregationType: 'byProperty',
            },
        });

        if (res.data.rows) {
            return res.data.rows.map(row => row.keys[0]);
        }
        return [];

    } catch (error) {
        console.error("Search Console API Error:", error.message);
        return [];
    }
};

module.exports = { getTopKeywords };
