import express from 'express';
import Ad from '../models/Ad.js';
import CamSite from '../models/CamSite.js';

const router = express.Router();

// GET enabled ads
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find({ enabled: true }).select('name position code');
    res.json(ads);
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// GET enabled cam sites
router.get('/cams', async (req, res) => {
  try {
    const cams = await CamSite.find({ enabled: true }).sort({ order: 1 });
    res.json(cams);
  } catch { res.status(500).json({ error: 'Failed' }); }
});

export default router;
