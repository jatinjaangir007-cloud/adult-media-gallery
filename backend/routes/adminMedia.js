import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Media from "../models/Media.js";

const router = express.Router();

/* Cloudinary config */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Multer memory storage */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* UPLOAD MEDIA */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const base64 = req.file.buffer.toString('base64');

    const result = await cloudinary.v2.uploader.upload(
      `data:${req.file.mimetype};base64,${base64}`,
      { resource_type: 'auto' }
    );

    const media = await Media.create({
      title: req.file.originalname,          // ✅ REQUIRED
      fileUrl: result.secure_url,             // ✅ REQUIRED
      fileType: result.resource_type          // ✅ REQUIRED
    });

    res.status(200).json(media);

  } catch (err) {
    console.error('🔥 Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});


/* GET MEDIA */
router.get("/", async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });
  res.json(media);
});

export default router;
