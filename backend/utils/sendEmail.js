const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // If no SMTP credentials, just log the OTP to help development
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[DEV MODE] Simulated Email to: ${options.to}`);
        console.log(`[DEV MODE] Subject: ${options.subject}`);
        console.log(`[DEV MODE] Message: ${options.text}`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `Travel Blog Security <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            text: options.text
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${options.to}`);
    } catch (error) {
        console.error('Nodemailer error:', error);
        throw error;
    }
};

module.exports = sendEmail;
