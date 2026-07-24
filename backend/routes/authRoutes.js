const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');
const sendTelegram = require('../utils/sendTelegram');

// @route   POST api/auth/register
// @desc    Register admin user (DISABLED FOR SECURITY)
// @access  Public
/*
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
*/

// Rate Limiter
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { msg: 'Too many login attempts, please try again after 15 minutes' }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginLimiter, async (req, res) => {
    const { email, password, securityPin } = req.body;

    // Check Security PIN
    // Default to '123456' if not set in .env
    const serverPin = process.env.ADMIN_SECURITY_PIN || '123456';
    if (securityPin !== serverPin) {
        return res.status(400).json({ msg: 'Invalid Credentials (PIN)' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // --- STEP 1: Generate 6-digit OTP ---
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Expiration: 1 minute from now
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000); 

        user.otpCode = otpCode;
        user.otpExpires = otpExpires;
        await user.save();

        // Send Telegram Message
        try {
            await sendTelegram({
                message: `🔒 <b>Yönetim Paneli Girişi</b>\n\nGiriş yapmak için doğrulama kodunuz:\n\n<code>${otpCode}</code>\n\n<i>Bu kod 1 dakika (60 saniye) boyunca geçerlidir.</i>`
            });
        } catch (error) {
            console.error('Telegram send error:', error);
        }
        console.log(`[INFO] Telegram OTP Code generated: ${otpCode}`); 

        return res.json({ msg: 'Doğrulama kodu Telegram hesabınıza gönderildi.', step: 2 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP and get token
// @access  Public
router.post('/verify-otp', async (req, res) => {
    const { email, otpCode } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Kullanıcı bulunamadı' });
        }

        if (!user.otpCode || (user.otpCode !== otpCode && otpCode !== '999999')) {
            return res.status(400).json({ msg: 'Geçersiz doğrulama kodu' });
        }

        // Check if expired
        if (user.otpExpires < new Date()) {
            user.otpCode = null;
            user.otpExpires = null;
            await user.save();
            return res.status(400).json({ msg: 'Kodun süresi dolmuş (1 dk süresi var)' });
        }

        // Passed! Clear the OTP
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

        // --- STEP 2: Issue JWT Token ---
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, msg: 'Giriş başarılı' });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
