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

// @route   POST api/auth/login
// @desc    Authenticate user & send Telegram OTP
// @access  Public
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password, securityPin } = req.body;

    // Check Security PIN
    const serverPin = process.env.ADMIN_SECURITY_PIN || '123456';
    if (securityPin !== serverPin) {
        return res.status(400).json({ msg: 'Geçersiz Güvenlik PIN Kodu' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Geçersiz E-Posta veya Şifre' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Geçersiz E-Posta veya Şifre' });
        }

        // Generate 6-digit secure OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiration: 2 minutes
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000); 

        user.otpCode = otpCode;
        user.otpExpires = otpExpires;
        await user.save();

        // Send Telegram OTP Message
        const telegramSent = await sendTelegram({
            message: `🔒 <b>Ceylan.m.e Yönetim Paneli Girişi</b>\n\nGiriş yapmak için tek kullanımlık doğrulama kodunuz:\n\n<code>${otpCode}</code>\n\n<i>Bu kod 2 dakika boyunca geçerlidir. Güvenliğiniz için kimseyle paylaşmayın.</i>`
        });

        if (!telegramSent) {
            console.log(`[SECURE FALLBACK LOG] Telegram OTP Code: ${otpCode}`);
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
router.post('/verify-otp', async (req, res) => {
    const { email, otpCode } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Kullanıcı bulunamadı' });
        }

        // Strict OTP match check
        if (!user.otpCode || user.otpCode !== otpCode) {
            return res.status(400).json({ msg: 'Hatalı veya geçersiz doğrulama kodu' });
        }

        // Check expiration
        if (user.otpExpires < new Date()) {
            user.otpCode = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ msg: 'Doğrulama kodunun süresi dolmuş. Lütfen tekrar giriş yapın.' });
        }

        // Clear used OTP
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

        // Issue Secure JWT Token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 86400 }, // 24 hours
            (err, token) => {
                if (err) throw err;
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
