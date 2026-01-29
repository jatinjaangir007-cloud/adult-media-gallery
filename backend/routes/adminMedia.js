import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ================= STORAGE =================
const uploadDir = path.join(process.cwd(), 'backend/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ================= TEMP IN-MEMORY STORE =================
// (Replace with Mongo schema later if needed)
const mediaStore = [];

// ================= ADMIN UPLOAD =================
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const { title, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileType = req.file.mimetype.startsWith('video')
      ? 'video'
      : 'image';

    const media = {
      title,
      tags: tags?.split(',').map(t => t.trim()),
      fileType,
      fileUrl: `/uploads/${req.file.filename}`,
      createdAt: new Date()
    };

    mediaStore.unshift(media);

    res.json({ success: true, media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ================= PUBLIC MEDIA LIST =================
router.get('/', (req, res) => {
  res.json({ media: mediaStore });
});

// ================= PUBLIC SEARCH =================
router.get('/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const filtered = mediaStore.filter(m =>
    m.title.toLowerCase().includes(q)
  );
  res.json({ media: filtered });
});

export default router;
