const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
// const { instagramGetUrl } = require("instagram-url-direct"); // Disable unreliable library
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const downloadVideo = async (url, destPath) => {
    const writer = fs.createWriteStream(destPath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

exports.analyzeInstagramVideo = async (req, res) => {
    const { url, caption } = req.body;
    let tempFilePath = null;

    // 1. Determine Source (File Upload or URL)
    try {
        if (req.file) {
            console.log("File uploaded:", req.file.path);
            tempFilePath = req.file.path;
        } else if (url) {
            // Deprecated: Instagram scraping is blocked.
            return res.status(400).json({
                error: "Instagram bağlantısı üzerinden analiz şu an çalışmıyor (Instagram engellemesi). Lütfen videoyu indirip 'Video Yükle' seçeneğini kullanın."
            });
        } else {
            return res.status(400).json({ error: "Lütfen bir video dosyası yükleyin." });
        }

        // 2. Upload to Gemini File Manager
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
            mimeType: "video/mp4",
            displayName: "Instagram Video Analysis",
        });

        // Wait for file processing to complete
        let file = await fileManager.getFile(uploadResult.file.name);
        console.log(`[DEBUG] Initial file state: ${file.state}`); // e.g. PROCESSING
        console.log(`[DEBUG] File Name: ${file.name}`);

        // Loop until active or failed
        while (file.state === "PROCESSING") {
            console.log("[DEBUG] State is PROCESSING, waiting 5s...");
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Increase wait to 5s
            file = await fileManager.getFile(uploadResult.file.name);
            console.log(`[DEBUG] Polled state: ${file.state}`);
        }

        if (file.state !== "ACTIVE") {
            console.error(`[DEBUG] Unexpected final state: ${file.state}`);
            throw new Error(`Video processing failed. State: ${file.state}`);
        }

        if (file.state === "FAILED") {
            throw new Error("Video processing failed on Gemini server.");
        }

        console.log(`File processing complete: ${file.state}`);

        // 3. Generate Content (Prompt)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Fetch SEO Keywords from Search Console (if configured)
        const { getTopKeywords } = require('../services/searchConsoleService'); // Lazy load
        const seoKeywords = await getTopKeywords();
        const keywordsText = seoKeywords.length > 0
            ? `Site için Gerçek GSC SEO Anahtar Kelimeleri (Bunları yazı içinde doğal şekilde geçir): ${seoKeywords.join(', ')}`
            : "SEO Hedefi: Genel yüksek hacimli seyahat terimleri kullan.";

        const prompt = `
        Bu videoyu profesyonel bir seyahat blogger'ı gibi analiz et.
        ${caption ? `Ekstra Bilgi (Instagram): "${caption}"` : ''}
        ${keywordsText}
        
        **GÖREV:** İzleyicileri etkileyecek, bilgilendirici ve SEO uyumlu, yayınlanmaya hazır tam bir **Seyahat Blog Yazısı** yaz.
        
        **Yazı Karakteristiği:**
        1.  **Stil:** Hem edebi/betimleyici (atmosferi hissettir) hem de bilgilendirici (tarih, kültür, pratik bilgi ver).
        2.  **Yapı:** Kesinlikle H1 (Ana Başlık), H2 (Alt Başlıklar) ve paragraflar kullanılmalı.
        3.  **İçerik:** Sadece "çok güzeldi" deme; mekanın adını, önemini, ne yapıldığını detaylı anlat.
        
        **İstenen Format (Markdown):**
        
        # [SEO Uyumlu ve Çekici Ana Başlık]
        
        **Giriş**
        [Okuyucuyu hemen yakalayan, videodaki o anın büyüsünü ve mekanın genel havasını anlatan güçlü bir giriş paragrafı.]
        
        ## 📍 Mekan ve Atmosfer
        [Videoda görünen yer neresi? Mimarisi, doğası veya şehir dokusu nasıl? Detaylı betimlemeler ve mekanın ruhu hakkında gözlemler.]
        
        ## 💡 Neden Burayı Görmelisiniz?
        [Burayı özel kılan şeyler ne? Tarihi önemi, kültürel değeri veya sunduğu eşsiz deneyimler. Bilgi verici kısım.]
        
        ## 🎒 Gezginler İçin İpuçları
        *   **Ne Zaman Gidilir:** [Öneri]
        *   **Ne Yapılır:** [Aktivite önerileri]
        *   **Fotoğraf İpucu:** [Videodaki gibi kareler yakalamak için tavsiye]
        
        ## 📉 SEO Analizi ve Performans (Google Search Console Verileri)
        *   **Hedeflenen Anahtar Kelimeler:** ${seoKeywords.length > 0 ? seoKeywords.join(', ') : 'Genel Seyahat Terimleri'}
        *   **Potansiyel Organik Trafik:** Yüksek (Trendlere Dayalı)
        *   **Öneri:** Bu yazı, sitenizin mevcut otoritesini güçlendirecek şekilde kurgulandı.
        
        ## Sonuç
        [Okuyucuyu seyahate çıkmaya motive eden, akılda kalıcı bir kapanış.]
        
        **Etiketler:** #Seyahat, #Keşif, ...
        `;

        const resultGen = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResult.file.mimeType,
                    fileUri: uploadResult.file.uri
                }
            },
            { text: prompt }
        ]);

        const responseText = resultGen.response.text();

        // Cleanup
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            // Verify if it was a multer upload (in temp) or downloaded file
            // If multer, logic is same.
            fs.unlinkSync(tempFilePath);
        }

        try {
            await fileManager.deleteFile(uploadResult.file.name);
        } catch (e) {
            console.error("Gemini file delete error:", e);
        }

        res.json({ content: responseText });

    } catch (error) {
        console.error("AI Analysis Error:", error);
        if (tempFilePath && fs.existsSync(tempFilePath) && !req.file) {
            // Only delete if we created it manually (though multer also creates it, usually good to clean up)
            fs.unlinkSync(tempFilePath);
        }
        // If multer file exists and error occurred, might want to clean it up too
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: "Analiz hatası: " + error.message });
    }
};
