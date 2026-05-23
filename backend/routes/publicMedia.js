import express from 'express';
import Media from '../models/Media.js';

const router = express.Router();

// GET all (with optional category & type filters)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.type     && req.query.type     !== 'all') filter.fileType  = req.query.type;
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load media' });
  }
});

// SEARCH
router.get('/search', async (req, res) => {
  try {
    const q    = req.query.q || '';
    const filter = {
      $or: [
        { title:    { $regex: q, $options: 'i' } },
        { tags:     { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    };
    const media = await Media.find(filter).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
});

// GET categories list with counts
router.get('/categories', async (req, res) => {
  try {
    const agg = await Media.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(agg.map(a => ({ name: a._id, count: a.count })));
  } catch {
    res.status(500).json({ message: 'Failed' });
  }
});

// GET single + increment views
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!media) return res.status(404).json({ message: 'Not found' });
    res.json(media);
  } catch {
    res.status(500).json({ message: 'Failed to load media' });
  }
});

export default router;
