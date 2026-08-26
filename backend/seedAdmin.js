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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Check if admin exists
        let admin = await User.findOne({ email: 'admin@example.com' });
        if (admin) {
            admin.password = hashedPassword;
            await admin.save();
            console.log('Admin user updated: admin@example.com / admin123');
            process.exit();
        }

        // Create Admin
        admin = new User({
            email: 'admin@example.com',
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created: admin@example.com / admin123');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
