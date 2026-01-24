import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Media from "../models/Media.js";

const router = express.Router();

/* Multer (memory storage) */
const upload = multer({ storage: multer.memoryStorage() });

/* GET all media */
router.get("/", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Failed to load media" });
  }
});

/* UPLOAD media */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        resource_type: "auto"
      }
    );

    const media = new Media({
      url: uploadResult.secure_url,
      type: uploadResult.resource_type
    });

    await media.save();
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

/* DELETE media */
router.delete("/:id", async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
