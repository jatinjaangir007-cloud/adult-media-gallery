import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import auth from '../middleware/auth.js';
import Media from '../models/Media.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ══════════════════════════════════════════════════
//  GET UPLOAD CONFIG
//  Returns only public info needed for unsigned upload.
//  No secrets exposed.
// ══════════════════════════════════════════════════
router.get('/upload-config', auth, (req, res) => {
  const cloudName    = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    return res.status(500).json({
      error: 'CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET not set in environment variables.'
    });
  }

  res.json({ cloudName, uploadPreset });
});

// ══════════════════════════════════════════════════
//  CONFIRM — save metadata to MongoDB after upload
// ══════════════════════════════════════════════════
router.post('/confirm', auth, async (req, res) => {
  try {
    const { title, category, tags, fileUrl, cloudinaryId, fileType } = req.body;

    if (!title || !fileUrl || !cloudinaryId || !fileType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const media = await Media.create({
      title,
      category: category || 'uncategorized',
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      fileType,
      fileUrl,
      cloudinaryId,
    });

    res.json({ success: true, media });
  } catch (err) {
    console.error('Confirm error:', err);
    res.status(500).json({ error: err.message || 'Failed to save media' });
  }
});

// ══════════════════════════════════════════════════
//  LIST ALL
// ══════════════════════════════════════════════════
router.get('/', auth, async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// ══════════════════════════════════════════════════
//  EDIT
// ══════════════════════════════════════════════════
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, category, tags } = req.body;
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category: category || 'uncategorized',
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      },
      { new: true }
    );
    if (!media) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: 'Edit failed' });
  }
});

// ══════════════════════════════════════════════════
//  DELETE — removes from Cloudinary + MongoDB
// ══════════════════════════════════════════════════
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Not found' });

    if (media.cloudinaryId) {
      await cloudinary.uploader.destroy(media.cloudinaryId, {
        resource_type: media.fileType === 'video' ? 'video' : 'image',
      });
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
