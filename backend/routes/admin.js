import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import cloudinary from "cloudinary";
import Media from "../models/Media.js";
import auth from "../middleware/auth.js";

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ==========================
// LOGIN
// ==========================
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================
// FILE UPLOAD
// ==========================
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, uploaded) => {
        if (error) return res.status(500).json({ error });

        const media = new Media({
          title: req.body.title,
          tags: req.body.tags?.split(",") || [],
          fileUrl: uploaded.secure_url,
          fileType: uploaded.resource_type
        });

        await media.save();
        res.json({ success: true });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
