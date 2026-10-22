const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { envTrim } = require('../utils/env');

/**
 * ADMIN_EMAIL + ADMIN_PASSWORD ile MongoDB admin kullanıcısını günceller/oluşturur.
 * Şifre ve e-posta yalnızca ortam değişkenlerinden okunur; kaynak koda yazılmaz.
 */
async function ensureAdminUser() {
    const email = envTrim('ADMIN_EMAIL');
    const password = envTrim('ADMIN_PASSWORD');

    if (!email || !password) {
        console.warn('[adminBootstrap] ADMIN_EMAIL veya ADMIN_PASSWORD tanımlı değil; DB kullanıcısı değiştirilmedi.');
        return;
    }

    if (password.length < 12) {
        console.error('[adminBootstrap] ADMIN_PASSWORD en az 12 karakter olmalı.');
        return;
    }

    const normalizedEmail = email.toLowerCase();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    let admin = await User.findOne({ email: normalizedEmail });
    if (!admin) {
        admin = await User.findOne({ email: { $regex: /^admin@/i } });
    }

    if (admin) {
        admin.email = normalizedEmail;
        admin.password = hashedPassword;
        await admin.save();
        console.log('[adminBootstrap] Admin kullanıcı güncellendi.');
        return;
    }

    admin = new User({
        email: normalizedEmail,
        password: hashedPassword
    });
    await admin.save();
    console.log('[adminBootstrap] Admin kullanıcı oluşturuldu.');
}

module.exports = { ensureAdminUser };
