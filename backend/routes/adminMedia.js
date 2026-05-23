import express from 'express';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import auth from '../middleware/auth.js';
import Media from '../models/Media.js';

const router = express.Router();

// ═══════════════ CLOUDINARY CONFIG ═══════════════
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ═══════════════════════════════════════════════════════
//  STEP 1 — Frontend requests a signed upload params
//  Server signs params; browser uploads directly to Cloudinary
//  File bytes NEVER touch this server → no RAM crash, no timeout
// ═══════════════════════════════════════════════════════
router.post('/sign', auth, (req, res) => {
  try {
    const { resource_type = 'auto' } = req.body;

    const timestamp  = Math.round(Date.now() / 1000);
    const folder     = 'velvethub';
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;

    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');

    res.json({
      signature,
      timestamp,
      folder,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      resource_type,
    });
  } catch (err) {
    console.error('Sign error:', err);
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
});

// ═══════════════════════════════════════════════════════
//  STEP 2 — After Cloudinary upload succeeds, frontend
//  calls this to save metadata to MongoDB
// ═══════════════════════════════════════════════════════
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

// ═══════════════ LIST ALL ═══════════════
router.get('/', auth, async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// ═══════════════ EDIT ═══════════════
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

// ═══════════════ DELETE ═══════════════
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
