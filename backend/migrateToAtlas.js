/**
 * MongoDB Veri Taşıma Scripti
 * Local MongoDB'den Atlas'a tüm koleksiyonları kopyalar
 * 
 * Kullanım: node migrateToAtlas.js "mongodb+srv://USER:PASS@cluster.mongodb.net/travelblog"
 */

const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017/travelblog';
const ATLAS_URI = process.argv[2];

if (!ATLAS_URI) {
    console.error('❌ Atlas URI gerekli!');
    console.error('Kullanım: node migrateToAtlas.js "mongodb+srv://..."');
    process.exit(1);
}

async function migrate() {
    console.log('🔌 Local MongoDB\'ye bağlanılıyor...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Local bağlantı kuruldu');

    console.log('🔌 Atlas\'a bağlanılıyor...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Atlas bağlantısı kuruldu');

    const localDb = localConn.db;
    const atlasDb = atlasConn.db;

    // Tüm koleksiyonları al
    const collections = await localDb.listCollections().toArray();
    console.log(`\n📦 ${collections.length} koleksiyon bulundu: ${collections.map(c => c.name).join(', ')}\n`);

    let totalDocs = 0;

    for (const col of collections) {
        const colName = col.name;
        const docs = await localDb.collection(colName).find({}).toArray();
        
        if (docs.length === 0) {
            console.log(`⏭️  ${colName}: boş, atlandı`);
            continue;
        }

        // Atlas'ta aynı koleksiyonu temizle ve yeniden yaz
        await atlasDb.collection(colName).deleteMany({});
        await atlasDb.collection(colName).insertMany(docs);
        
        console.log(`✅ ${colName}: ${docs.length} döküman taşındı`);
        totalDocs += docs.length;
    }

    console.log(`\n🎉 Tamamlandı! Toplam ${totalDocs} döküman Atlas'a taşındı.`);

    await localConn.close();
    await atlasConn.close();
}

migrate().catch(err => {
    console.error('❌ Hata:', err.message);
    process.exit(1);
});
