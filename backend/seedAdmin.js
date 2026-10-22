const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog')
    .then(() => console.log('MongoDB Connected for Seed'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedAdmin = async () => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || '').trim();
        const adminPassword = (process.env.ADMIN_PASSWORD || '').trim();
        if (!adminEmail) {
            console.error('ADMIN_EMAIL env değişkenini ayarlayın.');
            process.exit(1);
        }
        if (!adminPassword || adminPassword.length < 12) {
            console.error('ADMIN_PASSWORD env değişkenini (en az 12 karakter) ayarlayın. Örn: $env:ADMIN_PASSWORD="..." ; node seedAdmin.js');
            process.exit(1);
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        const normalizedEmail = adminEmail.toLowerCase();

        let admin = await User.findOne({ email: normalizedEmail });
        if (!admin) {
            admin = await User.findOne({ email: { $regex: /^admin@/i } });
        }

        if (admin) {
            admin.email = normalizedEmail;
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin user updated.');
            process.exit();
        }

        admin = new User({
            email: normalizedEmail,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
