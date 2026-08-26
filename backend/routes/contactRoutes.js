const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sendTelegram = require('../utils/sendTelegram');
const { escapeHtml } = require('../utils/sendTelegram');

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Lütfen zorunlu alanları doldurun.' });
        }

        // 1. Send via Telegram (Instant Notification)
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeSubject = escapeHtml(subject || 'Yok');
        const safeMessage = escapeHtml(message);

        const telegramMessage = `📧 <b>Yeni İletişim Formu Mesajı</b>\n\n` +
                               `👤 <b>Gönderen:</b> ${safeName}\n` +
                               `📧 <b>E-posta:</b> ${safeEmail}\n` +
                               `📝 <b>Konu:</b> ${safeSubject}\n\n` +
                               `💬 <b>Mesaj:</b>\n${safeMessage}`;

        await sendTelegram({ message: telegramMessage });

        // 2. Send via Email (Nodemailer) if configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
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
            } catch (mailErr) {
                console.error('Nodemailer error:', mailErr.message);
            }
        }

        res.status(200).json({ message: 'Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.' });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' });
    }
});

module.exports = router;
