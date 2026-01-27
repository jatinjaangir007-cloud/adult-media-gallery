import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Media from '../models/Media.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'backend/uploads/videos');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, tags } = req.body;

    // ✅ SAVE TO MONGODB (THIS WAS MISSING)
    const media = new Media({
      title: title || '',
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      filename: req.file.filename,
      fileUrl: `/uploads/videos/${req.file.filename}`,
      fileType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      createdAt: new Date()
    });

    await media.save();

    res.json({
      success: true,
      media
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
