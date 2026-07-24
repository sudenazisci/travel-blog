const sendTelegram = async ({ message }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Dev Mode Fallback: Just log it
    if (!token || !chatId) {
        console.log(`\n=========================================`);
        console.log(`[TELEGRAM DEV MODE] Mesaj Gönderilemedi.`);
        console.log(`Lütfen .env dosyasına TELEGRAM_BOT_TOKEN ve TELEGRAM_CHAT_ID ekleyin.`);
        console.log(`Gidecek Mesaj İçeriği: \n${message}`);
        console.log(`=========================================\n`);
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`Telegram AP Error: ${data.description}`);
        }
        
        console.log('[INFO] Telegram OTP successfully sent.');
    } catch (error) {
        console.error('Telegram Send Error:', error);
        throw error;
    }
};

module.exports = sendTelegram;
