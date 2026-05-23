import express from 'express';
import auth from '../middleware/auth.js';
import Ad from '../models/Ad.js';

const router = express.Router();

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const ads = await Ad.find().sort({ position: 1 });
    res.json({ success: true, ads });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { name, position, code, enabled } = req.body;
    const ad = await Ad.create({ name, position, code, enabled: enabled !== false });
    res.json({ success: true, ad });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, position, code, enabled } = req.body;
    const ad = await Ad.findByIdAndUpdate(req.params.id, { name, position, code, enabled }, { new: true });
    if (!ad) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, ad });
  } catch { res.status(500).json({ error: 'Update failed' }); }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Delete failed' }); }
});

export default router;
