const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');  // Add this import
const Media = require('../models/Media');
const { authenticateAdmin } = require('../middleware/auth');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer memory storage (no disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('adminToken', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Upload media (admin only)
router.post('/media', authenticateAdmin, upload.single('media'), async (req, res) => {
  try {
    const { title, tags } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'adult-media' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    // Save metadata to MongoDB
    const media = new Media({
      title,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      type: result.resource_type === 'video' ? 'video' : 'photo',
      cloudUrl: result.secure_url
    });
    await media.save();
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit media (admin only)
router.put('/media/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, tags } = req.body;
    const media = await Media.findByIdAndUpdate(req.params.id, {
      title,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    }, { new: true });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete media (admin only)
router.delete('/media/:id', authenticateAdmin, async (req, res) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (media) {
      // Optionally delete from Cloudinary (not required, but good practice)
      const publicId = media.cloudUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`adult-media/${publicId}`);
    }
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;