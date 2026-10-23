
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { v2: cloudinary } = require('cloudinary');
const auth = require('../middleware/authMiddleware');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(req, file, cb) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Yalnızca JPG, PNG, WEBP ve GIF yükleyebilirsiniz.'));
        }
    }
});

function uploadBuffer(buffer, options) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
}

// POST /api/upload
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'Resim yüklenemedi.' });
    }

    try {
        const optimizedBuffer = await sharp(req.file.buffer)
            .rotate()
            .webp({ quality: 90 })
            .toBuffer();

        const result = await uploadBuffer(optimizedBuffer, {
            folder: 'ceylanme/blog',
            resource_type: 'image',
            format: 'webp'
        });

        return res.json({
            url: result.secure_url,
            secure_url: result.secure_url,
            publicId: result.public_id,
            fileName: result.public_id
        });
    } catch (error) {
        console.error('Cloudinary yükleme hatası:', error.message);
        return res.status(500).json({
            msg: 'Görsel yüklenemedi. Depolama ayarlarını kontrol edin.'
        });
    }
});

// GET /api/upload/files
// Admin panelindeki medya galerisi
router.get('/files', auth, async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'ceylanme/blog/',
            resource_type: 'image',
            max_results: 100
        });

        return res.json(
            result.resources.map(file => ({
                name: file.public_id,
                url: file.secure_url,
                publicId: file.public_id,
                createdAt: file.created_at
            }))
        );
    } catch (error) {
        console.error('Cloudinary galeri hatası:', error.message);
        return res.status(500).json({
            msg: 'Görseller galeriden alınamadı.'
        });
    }
});

module.exports = router;
