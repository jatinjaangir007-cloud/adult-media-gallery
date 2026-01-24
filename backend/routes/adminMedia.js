import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import Media from '../models/Media.js';

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all media
router.get('/', async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });
  res.json(media);
});

// UPLOAD media
router.post('/upload', upload.single('media'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { resource_type: 'auto' }
    );

    const media = await Media.create({ url: result.secure_url });
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
