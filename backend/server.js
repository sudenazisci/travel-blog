const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Security Packages
const helmet = require('helmet');
const { noSqlInjectionPrevent, customHpp } = require('./middleware/securityMiddleware');
const rateLimit = require('express-rate-limit');

// Enable CORS - MUST BE FIRST
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Global Rate Limiting - DISABLED FOR DEVELOPMENT
/*
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 1000, 
    message: { error: 'Çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin.' }
});
app.use('/api', apiLimiter);
*/

// Custom Security Middlewares (Compatible with Express 5)
app.use(noSqlInjectionPrevent);
app.use(customHpp);

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adRoutes = require('./routes/adRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const contactRoutes = require('./routes/contactRoutes');
// const regionRoutes = require('./routes/regionRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
// app.use('/api/regions', regionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/', sitemapRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Make uploads folder static
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Travel Blog API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Start Cron Jobs
    require('./services/cronService')();
});
