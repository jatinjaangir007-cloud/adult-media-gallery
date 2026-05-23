import express from 'express';
import auth from '../middleware/auth.js';
import CamSite from '../models/CamSite.js';

const router = express.Router();

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const cams = await CamSite.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, cams });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, imageUrl, affiliateUrl, badge, enabled, order } = req.body;
    const cam = await CamSite.create({ name, description, imageUrl, affiliateUrl, badge, enabled: enabled !== false, order: order || 0 });
    res.json({ success: true, cam });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, imageUrl, affiliateUrl, badge, enabled, order } = req.body;
    const cam = await CamSite.findByIdAndUpdate(req.params.id, { name, description, imageUrl, affiliateUrl, badge, enabled, order }, { new: true });
    if (!cam) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, cam });
  } catch { res.status(500).json({ error: 'Update failed' }); }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    await CamSite.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch { res.status(500).json({ error: 'Delete failed' }); }
});

export default router;
