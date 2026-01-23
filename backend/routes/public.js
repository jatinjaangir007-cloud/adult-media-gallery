import express from "express";
import Media from "../models/Media.js";

const router = express.Router();

// Get all media
router.get("/media", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search media
router.get("/media/search", async (req, res) => {
  const { q } = req.query;

  try {
    const media = await Media.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } }
      ]
    });

    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
