require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const Media = require('./models/Media');

const app = express();

/* ===================== BASIC MIDDLEWARE ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== MONGODB ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

/* ===================== CLOUDINARY ===================== */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* ===================== MULTER ===================== */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }
});

/* ===================== API ROUTES ===================== */

/* ===================== ADMIN LOGIN ===================== */
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      role: 'admin'
    });
  }

  res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});


/* Admin upload */
app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File missing' });
    }

    const isVideo = req.file.mimetype.startsWith('video');
    const mediaType = isVideo ? 'video' : 'image';

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: isVideo ? 'video' : 'image',
          folder: 'velvethub'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const media = new Media({
      title: req.body.title || 'Untitled',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      type: mediaType,
      cloudUrl: uploadResult.secure_url
    });

    await media.save();
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

/* Public media */
app.get('/api/media', async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });
  res.json(media);
});

/* ===================== STATIC FILES ===================== */
const PUBLIC_DIR = path.join(__dirname, '../frontend/public');
app.use(express.static(PUBLIC_DIR));

/* ===================== ADMIN PAGE (EXPLICIT) ===================== */
app.get('/admin', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'admin.html'));
});

/* ===================== PUBLIC PAGE (EXPLICIT) ===================== */
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
