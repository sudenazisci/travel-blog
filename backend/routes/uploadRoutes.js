
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const auth = require('../middleware/authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = 'blog-images';

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase yapılandırması eksik: SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    })
    : null;

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

// POST /api/upload
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'Resim seçilmedi veya yüklenemedi.' });
    }

    if (!supabase) {
        return res.status(500).json({
            msg: 'Görsel depolama yapılandırması eksik.'
        });
    }

    try {
        const optimizedBuffer = await sharp(req.file.buffer)
            .rotate()
            .webp({ quality: 85 })
            .toBuffer();

        const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
        const filePath = `posts/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, optimizedBuffer, {
                contentType: 'image/webp',
                cacheControl: '31536000',
                upsert: false
            });

        if (error) {
            throw error;
        }

        const { data: publicData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(data.path);

        return res.json({
            url: publicData.publicUrl,
            secure_url: publicData.publicUrl,
            filePath: publicData.publicUrl,
            fileName,
            path: data.path
        });
    } catch (error) {
        console.error('Supabase görsel yükleme hatası:', {
            message: error.message,
            statusCode: error.statusCode,
            name: error.name
        });

        return res.status(500).json({
            msg: 'Görsel yüklenemedi. Supabase ayarlarını kontrol edin.'
        });
    }
});

// GET /api/upload/files
// Admin panelindeki medya galerisi
router.get('/files', auth, async (req, res) => {
    if (!supabase) {
        return res.status(500).json({
            msg: 'Görsel depolama yapılandırması eksik.'
        });
    }

    try {
        const { data, error } = await supabase.storage
            .from(bucketName)
            .list('posts', {
                limit: 100,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            throw error;
        }

        const files = (data || [])
            .filter(file => file.name && file.name.endsWith('.webp'))
            .map(file => {
                const path = `posts/${file.name}`;
                const { data: publicData } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(path);

                return {
                    name: file.name,
                    url: publicData.publicUrl,
                    publicId: path,
                    createdAt: file.created_at
                };
            });

        return res.json(files);
    } catch (error) {
        console.error('Supabase galeri hatası:', {
            message: error.message,
            statusCode: error.statusCode
        });

        return res.status(500).json({
            msg: 'Görseller galeriden alınamadı.'
        });
    }
});

module.exports = router;
