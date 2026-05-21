import express from 'express';
import Media from '../models/Media.js';

const router = express.Router();

// GET all media
router.get('/', async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error('Public media fetch error:', err);
    res.status(500).json({ message: 'Failed to load media' });
  }
});

// SEARCH media
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const media = await Media.find({
      title: { $regex: q, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    console.error('Public media search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

// GET single media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Not found' });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load media' });
  }
});

export default router;
