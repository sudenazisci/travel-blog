const mongoose = require('mongoose');

// Her gerçek ziyaretçi (tarayıcı) için TEK kayıt. Kişisel veri (IP vb.) tutulmaz.
const VisitorSchema = new mongoose.Schema({
    vid: { type: String, required: true, unique: true, index: true },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: { type: Date, default: Date.now, index: true },
    visits: { type: Number, default: 0 },        // oturum (giriş) sayısı
    pageViews: { type: Number, default: 0 },     // toplam sayfa görüntüleme
    totalSeconds: { type: Number, default: 0 },  // sitede geçirilen toplam süre
    device: { type: String, default: 'masaüstü' },
    lastPath: { type: String, default: '/' },
    activeDays: { type: [String], default: [] }  // 'YYYY-MM-DD' - günlük tekil ziyaretçi için
});

module.exports = mongoose.model('Visitor', VisitorSchema);
