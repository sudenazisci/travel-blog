const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/authMiddleware');
const Visitor = require('../models/Visitor');
const Blog = require('../models/Blog');
const SiteSettings = require('../models/SiteSettings');

const trackLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 90,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: 'Too many requests' }
});

const VID_REGEX = /^[a-f0-9-]{36}$/i;
const BOT_REGEX = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|monitor|curl|wget|python|node-fetch|axios/i;
const today = () => new Date().toISOString().slice(0, 10);

// @route   POST api/stats/track
// @desc    Gerçek ziyaretçi kaydı (sayfa görüntüleme / süre). Admin istekleri frontend'de gönderilmez,
//          ayrıca geçerli admin token'ı ile gelen istekler sunucuda da yok sayılır.
router.post('/track', trackLimiter, async (req, res) => {
    try {
        if (BOT_REGEX.test(req.headers['user-agent'] || '')) return res.json({ ok: true });
        if (req.headers['x-auth-token'] && auth.isAdminRequest(req)) return res.json({ ok: true });

        const { vid, type, path, newSession, seconds } = req.body || {};
        if (typeof vid !== 'string' || !VID_REGEX.test(vid)) return res.status(400).json({ msg: 'invalid' });

        const cleanPath = typeof path === 'string' ? path.slice(0, 200) : '/';
        // Admin sayfaları asla sayılmaz
        if (/^\/(admin|yonetim)/i.test(cleanPath)) return res.json({ ok: true });

        const now = new Date();
        if (type === 'hit') {
            const ua = req.headers['user-agent'] || '';
            const device = /mobile|android|iphone|ipad/i.test(ua) ? 'mobil' : 'masaüstü';
            await Visitor.updateOne(
                { vid },
                {
                    $setOnInsert: { vid, firstSeen: now },
                    $set: { lastSeen: now, lastPath: cleanPath, device },
                    $inc: { pageViews: 1, visits: newSession === true ? 1 : 0 },
                    $addToSet: { activeDays: today() }
                },
                { upsert: true }
            );
        } else if (type === 'ping') {
            const s = Math.max(0, Math.min(Number(seconds) || 0, 120));
            await Visitor.updateOne({ vid }, { $set: { lastSeen: now }, $inc: { totalSeconds: s } });
        } else {
            return res.status(400).json({ msg: 'invalid' });
        }
        res.json({ ok: true });
    } catch (err) {
        console.error('Track error:', err.message);
        res.status(500).json({ msg: 'error' });
    }
});

// @route   GET api/stats/summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
    try {
        res.set('Cache-Control', 'no-store');
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;

        const [agg] = await Visitor.aggregate([
            {
                $group: {
                    _id: null,
                    unique: { $sum: 1 },
                    sessions: { $sum: '$visits' },
                    pageViews: { $sum: '$pageViews' },
                    seconds: { $sum: '$totalSeconds' },
                    returning: { $sum: { $cond: [{ $gt: ['$visits', 1] }, 1, 0] } }
                }
            }
        ]);
        const t = agg || { unique: 0, sessions: 0, pageViews: 0, seconds: 0, returning: 0 };

        const [online, activeToday, active7d] = await Promise.all([
            Visitor.countDocuments({ lastSeen: { $gte: new Date(now - 2 * 60 * 1000) } }),
            Visitor.countDocuments({ activeDays: today() }),
            Visitor.countDocuments({ lastSeen: { $gte: new Date(now - 7 * day) } })
        ]);

        // Son 14 gün günlük tekil ziyaretçi
        const days = [];
        for (let i = 13; i >= 0; i--) days.push(new Date(now - i * day).toISOString().slice(0, 10));
        const daily = await Visitor.aggregate([
            { $unwind: '$activeDays' },
            { $match: { activeDays: { $in: days } } },
            { $group: { _id: '$activeDays', count: { $sum: 1 } } }
        ]);
        const dailyMap = Object.fromEntries(daily.map(d => [d._id, d.count]));

        const visitors = await Visitor.find({}, '-activeDays -__v')
            .sort({ lastSeen: -1 })
            .limit(100)
            .lean();

        res.json({
            totals: {
                uniqueVisitors: t.unique,
                sessions: t.sessions,
                pageViews: t.pageViews,
                totalSeconds: t.seconds,
                returningVisitors: t.returning,
                avgSecondsPerVisitor: t.unique ? Math.round(t.seconds / t.unique) : 0,
                avgSecondsPerSession: t.sessions ? Math.round(t.seconds / t.sessions) : 0,
                online,
                activeToday,
                active7d
            },
            daily: days.map(d => ({ date: d, count: dailyMap[d] || 0 })),
            visitors: visitors.map(v => ({
                id: v.vid.slice(0, 8),
                firstSeen: v.firstSeen,
                lastSeen: v.lastSeen,
                visits: v.visits,
                pageViews: v.pageViews,
                totalSeconds: v.totalSeconds,
                device: v.device,
                lastPath: v.lastPath
            }))
        });
    } catch (err) {
        console.error('Stats summary error:', err.message);
        res.status(500).json({ msg: 'Sunucu hatası' });
    }
});

// @route   DELETE api/stats/reset
// @desc    Tüm ziyaretçi kayıtlarını, yazı görüntülenmelerini ve eski sayacı sıfırlar
// @access  Private
router.delete('/reset', auth, async (req, res) => {
    try {
        await Visitor.deleteMany({});
        await Blog.updateMany({}, { $set: { views: 0 } });
        await SiteSettings.updateMany({}, { $set: { totalVisitors: 0 } });
        res.json({ msg: 'İstatistikler sıfırlandı' });
    } catch (err) {
        console.error('Stats reset error:', err.message);
        res.status(500).json({ msg: 'Sunucu hatası' });
    }
});

module.exports = router;
