const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer for Video Upload (Temp storage)
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const tempDir = require('os').tmpdir();
        cb(null, tempDir);
    },
    filename(req, file, cb) {
        cb(null, `upload_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// router.post('/analyze-instagram', auth, upload.single('video'), aiController.analyzeInstagramVideo);
// router.post('/analyze-instagram', upload.single('video'), aiController.analyzeInstagramVideo); // Auth disabled for debug
router.post('/analyze-instagram', auth, upload.single('video'), aiController.analyzeInstagramVideo);

module.exports = router;
