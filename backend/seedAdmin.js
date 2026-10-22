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
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword || adminPassword.length < 12) {
            console.error('ADMIN_PASSWORD env değişkenini (en az 12 karakter) ayarlayın. Örn: $env:ADMIN_PASSWORD="..." ; node seedAdmin.js');
            process.exit(1);
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Check if admin exists
        let admin = await User.findOne({ email: 'ceylan.me@outlook.com' });
        if (!admin) {
            admin = await User.findOne({ email: 'admin@example.com' });
        }

        if (admin) {
            admin.email = 'ceylan.me@outlook.com';
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin user updated: ceylan.me@outlook.com');
            process.exit();
        }

        // Create Admin
        admin = new User({
            email: 'ceylan.me@outlook.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created: ceylan.me@outlook.com');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
