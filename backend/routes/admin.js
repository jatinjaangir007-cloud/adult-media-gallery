const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Media = require("../models/Media");
const auth = require("../middleware/auth");

const router = express.Router();

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

router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        async (error, uploaded) => {
          if (error) return res.status(500).json({ error });

          const media = new Media({
            title: req.body.title,
            tags: req.body.tags?.split(",") || [],
            url: uploaded.secure_url,
            type: uploaded.resource_type
          });

          await media.save();
          res.json({ success: true });
        }
      );

      result.end(req.file.buffer);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
