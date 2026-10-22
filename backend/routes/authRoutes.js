const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const sendTelegram = require('../utils/sendTelegram');

// Rate Limiter for Login Attempts
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { msg: 'Çok fazla hatalı giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' }
});

const crypto = require('crypto');

const safeEqual = (a, b) => {
    const ba = Buffer.from(String(a));
    const bb = Buffer.from(String(b));
    return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { msg: 'Çok fazla doğrulama denemesi. Lütfen 15 dakika sonra tekrar deneyin.' }
});

const MAX_OTP_ATTEMPTS = 5;

// @route   POST api/auth/login
// @desc    Authenticate user & send Telegram OTP
// @access  Public
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password, securityPin } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || typeof securityPin !== 'string') {
        return res.status(400).json({ msg: 'Geçersiz istek' });
    }

    // Güvenlik PIN'i environment variable olarak ZORUNLU (varsayılan değer yok)
    const serverPin = process.env.ADMIN_SECURITY_PIN;
    if (!serverPin || !auth.getSecret()) {
        console.error('ADMIN_SECURITY_PIN veya JWT_SECRET tanımlı değil.');
        return res.status(500).json({ msg: 'Sunucu yapılandırma hatası' });
    }
    if (!safeEqual(securityPin, serverPin)) {
        return res.status(400).json({ msg: 'Geçersiz Güvenlik PIN Kodu' });
    }

    try {
        let user = await User.findOne({ email: email.toLowerCase().trim() });

        // Kullanıcı yoksa da bcrypt çalıştır (zamanlama farkından kullanıcı tespitini önler)
        const hash = user ? user.password : '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
        const isMatch = await bcrypt.compare(password, hash);

        if (!user || !isMatch) {
            return res.status(400).json({ msg: 'Geçersiz E-Posta veya Şifre' });
        }

        // Generate 6-digit secure OTP (kriptografik rastgele)
        const otpCode = crypto.randomInt(100000, 1000000).toString();

        // Expiration: 2 minutes
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

        user.otpCode = otpCode;
        user.otpExpires = otpExpires;
        user.otpAttempts = 0;
        await user.save();

        // Send Telegram OTP Message
        const telegramSent = await sendTelegram({
            message: `🔒 <b>Ceylan.m.e Yönetim Paneli Girişi</b>\n\nGiriş yapmak için tek kullanımlık doğrulama kodunuz:\n\n<code>${otpCode}</code>\n\n<i>Bu kod 2 dakika boyunca geçerlidir. Güvenliğiniz için kimseyle paylaşmayın.</i>`
        });

        if (!telegramSent && process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
            console.log(`[DEV ONLY] Telegram OTP Code: ${otpCode}`);
        }

        return res.json({ msg: 'Doğrulama kodu Telegram hesabınıza gönderildi.', step: 2 });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Sunucu hatası oluştu' });
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and issue JWT Token
// @access  Public
router.post('/verify-otp', otpLimiter, async (req, res) => {
    const { email, otpCode } = req.body;

    if (typeof email !== 'string' || typeof otpCode !== 'string') {
        return res.status(400).json({ msg: 'Geçersiz istek' });
    }

    try {
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        const invalid = { msg: 'Hatalı veya geçersiz doğrulama kodu' };

        if (!user || !user.otpCode || !user.otpExpires) {
            return res.status(400).json(invalid);
        }

        // Süre kontrolü
        if (user.otpExpires < new Date()) {
            user.otpCode = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ msg: 'Doğrulama kodunun süresi dolmuş. Lütfen tekrar giriş yapın.' });
        }

        // Deneme sınırı: 5 yanlış denemeden sonra kod iptal edilir
        if ((user.otpAttempts || 0) >= MAX_OTP_ATTEMPTS) {
            user.otpCode = null;
            user.otpExpires = null;
            await user.save();
            return res.status(429).json({ msg: 'Çok fazla hatalı deneme. Lütfen tekrar giriş yapın.' });
        }

        if (!safeEqual(user.otpCode, otpCode)) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            await user.save();
            return res.status(400).json(invalid);
        }

        // Clear used OTP
        user.otpCode = null;
        user.otpExpires = null;
        user.otpAttempts = 0;
        await user.save();

        // Issue Secure JWT Token
        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            auth.getSecret(),
            { expiresIn: '12h', algorithm: 'HS256' },
            (err, token) => {
                if (err) {
                    console.error('JWT sign error:', err.message);
                    return res.status(500).json({ msg: 'Sunucu hatası' });
                }
                res.json({ token, msg: 'Giriş başarılı' });
            }
        );
    } catch (err) {
        console.error('Verify OTP error:', err.message);
        res.status(500).json({ msg: 'Sunucu hatası' });
    }
});

// @route   GET api/auth/user
// @desc    Get logged in admin user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Sunucu hatası');
    }
});

module.exports = router;
