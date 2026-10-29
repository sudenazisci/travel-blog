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

// Vercel/Render proxy arkasında gerçek IP'yi al (rate limit için gerekli)
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Body parser — büyük blog HTML + kapak URL; base64 görseller kayıtta dosyaya dönüştürülür
const JSON_BODY_LIMIT = '15mb';
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_BODY_LIMIT }));

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Global Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Çok fazla istek gönderildi, lütfen biraz sonra tekrar deneyin.' }
});
app.use('/api', apiLimiter);

// Custom Security Middlewares (Compatible with Express 5)
app.use(noSqlInjectionPrevent);
app.use(customHpp);

// Request Logger — istek sürelerini ölçer
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        console.log(
            `[PERFORMANCE] ${req.method} ${req.path} | ` +
            `Status: ${res.statusCode} | ${duration}ms`
        );
    });

    next();
});

// Public GET istekleri CDN'de kısa süre önbelleklenir (hızlı açılış).
// Admin token'lı, taslak içeren, auth ve stats istekleri ASLA önbelleğe alınmaz.
app.use('/api', (req, res, next) => {
    const url = req.originalUrl;
    const sensitive = req.headers['x-auth-token'] || req.headers.authorization ||
        url.includes('includeDrafts') || url.startsWith('/api/auth') ||
        url.startsWith('/api/stats') || url.startsWith('/api/upload');
    if (req.method === 'GET' && !sensitive) {
        res.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
    } else {
        res.set('Cache-Control', 'no-store');
    }
    res.set('Vary', 'x-auth-token');
    next();
});

// Sağlık kontrolü: DB'yi beklemeden anında yanıt verir (uyandırma/ping için hafif uç)
app.get('/healthz', (req, res) => {
    res.set('Cache-Control', 'no-store').json({ ok: true, db: mongoose.connection.readyState === 1 });
});

// Database Connection (serverless için bağlantı önbelleği)
let dbPromise = null;
const connectDB = () => {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (!dbPromise) {
        dbPromise = mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelblog', {
            serverSelectionTimeoutMS: 8000,
            maxPoolSize: 5
        })
            .then(() => console.log('MongoDB Connected'))
            .catch(err => { dbPromise = null; console.error('MongoDB Connection Error:', err); });
    }
    return dbPromise;
};

// Admin bootstrap: bağlantı kurulur kurulmaz tek sefer, paylaşılan promise ile çalışır.
let bootstrapPromise = null;
const ensureBootstrap = () => {
    if (mongoose.connection.readyState !== 1) return Promise.resolve();
    if (!bootstrapPromise) {
        bootstrapPromise = require('./services/adminBootstrap').ensureAdminUser()
            .catch(err => {
                bootstrapPromise = null;
                console.error('[adminBootstrap] Hata:', err.message);
            });
    }
    return bootstrapPromise;
};

// Boot sırasında başlat: ilk ziyaretçi isteği beklemeden DB + bootstrap hazırlanır
connectDB().then(() => ensureBootstrap());

// Her istek DB hazır olana kadar bekler (buffer timeout hatalarını önler)
app.use(async (req, res, next) => {
    await connectDB();
    // Yalnızca giriş istekleri bootstrap'in bitmesini bekler (parola güncellemesiyle yarışmasın).
    // Herkese açık GET istekleri bcrypt/yazma işlemini beklemez.
    if (req.originalUrl.startsWith('/api/auth')) {
        await ensureBootstrap();
    } else {
        ensureBootstrap();
    }
    next();
});

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
const statsRoutes = require('./routes/statsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
// app.use('/api/regions', regionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stats', statsRoutes);
app.use('/', sitemapRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        console.error('Payload too large:', err.length, 'limit:', err.limit);
        return res.status(413).json({
            msg: 'İstek gövdesi çok büyük. Görselleri galeriden yükleyin; yapıştırılan base64 görseller kayıtta otomatik dönüştürülür.'
        });
    }
    console.error('Unhandled Error:', err.message || err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Make uploads folder static
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Travel Blog API is running...');
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        // Start Cron Jobs
        require('./services/cronService')();
    });
}

module.exports = app;
