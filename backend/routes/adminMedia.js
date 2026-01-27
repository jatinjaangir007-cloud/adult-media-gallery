const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads/videos');

// ensure upload folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ DISK STORAGE (NOT MEMORY)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

// ✅ SAFE LIMITS (Render free)
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1 GB
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // ⚠️ IMPORTANT:
    // NO fs.readFile
    // NO ffmpeg
    // NO processing here

    res.json({
      success: true,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
