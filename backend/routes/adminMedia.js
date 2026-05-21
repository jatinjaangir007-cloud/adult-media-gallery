import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';
import Media from '../models/Media.js';

const router = express.Router();

// ================= STORAGE =================
const uploadDir = path.join(process.cwd(), 'backend/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'];
const MAX_SIZE_MB = 500;

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  }
});

// ================= ADMIN UPLOAD (protected) =================
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const media = await Media.create({
      title,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      fileType,
      fileUrl: `/uploads/${req.file.filename}`
    });

    res.json({ success: true, media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

export default router;
