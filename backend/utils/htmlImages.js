const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DATA_URI_RE = /src=(["'])(data:image\/(png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=]+))\1/gi;

const getUploadDir = () => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

/**
 * HTML içindeki data:image base64 gömülü img src değerlerini dosyaya yazar, URL ile değiştirir.
 */
async function externalizeDataUriImages(html) {
    if (typeof html !== 'string' || !html.includes('data:image')) {
        return html;
    }

    const uploadDir = getUploadDir();
    let result = html;
    const matches = [...html.matchAll(DATA_URI_RE)];

    for (const match of matches) {
        const fullDataUri = match[2];
        const format = (match[3] || 'png').toLowerCase().replace('jpg', 'jpeg');
        const base64Data = match[4];

        try {
            const buffer = Buffer.from(base64Data, 'base64');
            if (buffer.length > 10 * 1024 * 1024) {
                throw new Error('Gömülü görsel 10MB sınırını aşıyor');
            }

            const filename = `inline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
            const filePath = path.join(uploadDir, filename);

            await sharp(buffer)
                .webp({ quality: 90 })
                .toFile(filePath);

            const publicUrl = `/uploads/${filename}`;
            result = result.split(fullDataUri).join(publicUrl);
        } catch (err) {
            console.error('[htmlImages] Base64 görsel işlenemedi:', err.message);
            throw err;
        }
    }

    return result;
}

async function externalizeIfDataUri(value) {
    if (typeof value !== 'string') return value;
    if (!value.startsWith('data:image')) return value;

    const m = value.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,([A-Za-z0-9+/=]+)$/i);
    if (!m) return value;

    const uploadDir = getUploadDir();
    const buffer = Buffer.from(m[2], 'base64');
    if (buffer.length > 10 * 1024 * 1024) {
        throw new Error('Kapak görseli 10MB sınırını aşıyor');
    }

    const filename = `cover-${Date.now()}.webp`;
    await sharp(buffer).webp({ quality: 90 }).toFile(path.join(uploadDir, filename));
    return `/uploads/${filename}`;
}

module.exports = { externalizeDataUriImages, externalizeIfDataUri };
