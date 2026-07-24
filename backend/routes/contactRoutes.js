const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const axios = require('axios');

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Lütfen zorunlu alanları doldurun.' });
        }

        // 1. Send via Telegram (Instant Notification)
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID;

        if (telegramToken && telegramChatId) {
            const telegramMessage = `📧 *Yeni İletişim Formu Mesajı*\n\n` +
                                   `👤 *Gönderen:* ${name}\n` +
                                   `📧 *E-posta:* ${email}\n` +
                                   `📝 *Konu:* ${subject || 'Yok'}\n\n` +
                                   `💬 *Mesaj:*\n${message}`;

            await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                chat_id: telegramChatId,
                text: telegramMessage,
                parse_mode: 'Markdown'
            });
        }

        // 2. Send via Email (Nodemailer)
        // Note: This requires SMTP credentials in .env (EMAIL_USER, EMAIL_PASS, etc.)
        // If not provided, we will just log it for now but the Telegram will work.
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail', // or your provider
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'sudenazisci@gmail.com',
                subject: `İletişim Formu: ${subject || 'Yeni Mesaj'}`,
                text: `Ad: ${name}\nE-posta: ${email}\nKonu: ${subject}\n\nMesaj:\n${message}`
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: 'Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.' });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan e-posta gönderin.' });
    }
});

module.exports = router;
