import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import adminMediaRoutes from './routes/adminMedia.js';

// --------------------------------------------------
// ESM dirname fix
// --------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Router
// --------------------------------------------------
const router = express.Router();
app.use('/api/admin/media', adminMediaRoutes);
// --------------------------------------------------
// Upload directory
// --------------------------------------------------
const uploadDir = path.join(__dirname, '../../uploads/videos');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --------------------------------------------------
// Multer DISK storage (Render-safe)
// --------------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1 GB
  }
});

// --------------------------------------------------
// Upload route
// --------------------------------------------------
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // IMPORTANT:
    // No processing here
    // No fs.readFile
    // No ffmpeg

    return res.status(200).json({
      success: true,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Upload failed'
    });
  }
});

// --------------------------------------------------
// EXPORT (THIS WAS THE MISSING PART)
// --------------------------------------------------
export default router;
