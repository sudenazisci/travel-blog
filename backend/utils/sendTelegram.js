const axios = require('axios');

const escapeHtml = (text) => {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

const sendTelegram = async ({ message, parseMode = 'HTML' }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Dev / Log Fallback if credentials not present in .env
    if (!token || !chatId) {
        console.log(`\n=========================================`);
        console.log(`[TELEGRAM NOTIFICATION LOG]`);
        console.log(`TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in backend/.env.`);
        console.log(`Message Content:\n${message.replace(/<[^>]*>?/gm, '')}`);
        console.log(`=========================================\n`);
        return true;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: parseMode
        }, { timeout: 8000 });

        console.log('[INFO] Telegram notification successfully delivered.');
        return true;
    } catch (error) {
        console.error('Telegram API Send Error:', error?.response?.data || error.message);
        
        // Fallback retry without parse_mode if formatting fails
        try {
            const url = `https://api.telegram.org/bot${token}/sendMessage`;
            const plainMessage = message.replace(/<[^>]*>?/gm, '');
            await axios.post(url, {
                chat_id: chatId,
                text: plainMessage
            }, { timeout: 8000 });
            console.log('[INFO] Telegram fallback plain text notification sent.');
            return true;
        } catch (retryErr) {
            console.error('Telegram retry failed:', retryErr.message);
        }
        return false;
    }
};

module.exports = sendTelegram;
module.exports.escapeHtml = escapeHtml;
