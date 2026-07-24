const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
});

const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @route   POST /api/upload
// @desc    Upload an image
router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Resim yüklenemedi.');
    }

    try {
        const originalPath = req.file.path;
        const newFilename = `hq-${Date.now()}.webp`;
        const newPath = path.join(req.file.destination, newFilename);

        // Resmin orijinal kalitesini bozmadan (%100) WebP optimizasyonu
        await sharp(originalPath)
            .webp({ quality: 100, lossless: true })
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
        res.status(500).send('Resim işlenirken sunucu hatası oluştu.');
    }
});

// @route   GET /api/upload/files
// @desc    List all uploaded images
router.get('/files', (req, res) => {
    const directoryPath = path.join(__dirname, '../uploads');

    // Create directory if it doesn't exist
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        return res.json([]);
    }

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files!');
        }
        // Filter for images and map to full URLs
        // Note: In production you might want to return full URLs including host
        // For now, we return relative paths which work on the frontend if configured correctly
        const fileInfos = files
            .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
            .map(file => ({
                name: file,
                url: `http://localhost:5000/uploads/${file}`
            }))
            .reverse(); // Newest first usually (but readdir order isn't guaranteed, normally sort by time would be better)

        res.json(fileInfos);
    });
});

module.exports = router;
