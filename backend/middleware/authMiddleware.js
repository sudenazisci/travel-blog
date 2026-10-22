const jwt = require('jsonwebtoken');

// JWT secret: production'da MUTLAKA environment variable olarak tanımlanmalı.
// Kod içinde tahmin edilebilir varsayılan secret YOKTUR (yalnızca local geliştirmede geçici anahtar).
const getSecret = () => {
    const raw = process.env.JWT_SECRET;
    const secret = typeof raw === 'string' ? raw.trim() : raw;
    if (secret && secret.length >= 24) return secret;
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) return 'dev-only-insecure-secret-change-me';
    return null;
};

const verifyToken = (token) => {
    const secret = getSecret();
    if (!secret || !token) return null;
    try {
        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
        return decoded.user || null;
    } catch (err) {
        return null;
    }
};

const auth = function (req, res, next) {
    if (!getSecret()) {
        console.error('JWT_SECRET tanımlı değil veya çok kısa (min 24 karakter).');
        return res.status(500).json({ msg: 'Sunucu yapılandırma hatası' });
    }
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const user = verifyToken(token);
    if (!user) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
    req.user = user;
    next();
};

// Zorunlu olmayan kontrol: istek geçerli bir admin token'ı taşıyor mu?
auth.isAdminRequest = (req) => !!verifyToken(req.header('x-auth-token'));
auth.getSecret = getSecret;

module.exports = auth;
