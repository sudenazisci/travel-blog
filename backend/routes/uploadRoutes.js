const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const auth = require('../middleware/authMiddleware');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `${Date.now()}_${sanitized}`);
    }
});

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Yalnızca resim dosyaları yükleyebilirsiniz (JPG, PNG, WEBP, GIF).'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Max File Size
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @route   POST /api/upload
// @desc    Upload an image
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'Resim yüklenemedi.' });
    }

    try {
        const originalPath = req.file.path;
        const newFilename = `hq-${Date.now()}.webp`;
        const newPath = path.join(req.file.destination, newFilename);

        // Resmin orijinal kalitesini bozmadan (%100) WebP optimizasyonu
        await sharp(originalPath)
            .webp({ quality: 90 })
            .toFile(newPath);

        // Orijinal ham dosyayı sil
        if (fs.existsSync(originalPath)) {
            fs.unlinkSync(originalPath);
        }

        res.json({
            filePath: `/uploads/${newFilename}`,
            fileName: newFilename
        });
    } catch (error) {
        console.error('Sharp Image Processing Error:', error);
        res.status(500).json({ msg: 'Resim işlenirken sunucu hatası oluştu.' });
    }
});

// @route   GET /api/upload/files
// @desc    List all uploaded images
// @access  Public / Admin
router.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads');

    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        return res.json([]);
    }

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ msg: 'Dosyalar okunamadı.' });
        }

        const fileInfos = files
            .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
            .map(file => ({
                name: file,
                url: `/uploads/${file}`
            }))
            .reverse();

        res.json(fileInfos);
    });
});

// @route   DELETE /api/upload/:filename
// @desc    Delete an uploaded image
// @access  Private
router.delete('/:filename', auth, (req, res) => {
    const filename = path.basename(req.params.filename); // Sanitize filename to prevent path traversal
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({ msg: 'Resim silindi.' });
    } else {
        return res.status(404).json({ msg: 'Dosya bulunamadı.' });
    }
});

module.exports = router;
