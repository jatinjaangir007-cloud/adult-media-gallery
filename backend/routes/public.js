const express = require('express');
const Media = require('../models/Media');
const router = express.Router();

// Get all media (public gallery)
router.get('/media', async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadDate: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search media by title or tags
router.get('/media/search', async (req, res) => {
  const { q } = req.query;
  try {
    const media = await Media.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;