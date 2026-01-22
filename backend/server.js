import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import multer from "multer";
import Media from "./Media.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// STATIC FILES (VERY IMPORTANT)
// ==========================
const __dirname = path.resolve();

app.use(
  "/css",
  express.static(path.join(__dirname, "frontend/public/css"))
);

app.use(
  "/js",
  express.static(path.join(__dirname, "frontend/public/js"))
);

// ==========================
// ADMIN PAGE
// ==========================
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/public/admin.html"));
});

// ==========================
// DATABASE
// ==========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ==========================
// FILE UPLOAD (LOCAL ONLY)
// ==========================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ==========================
// ADMIN UPLOAD API
// ==========================
app.post("/api/admin/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, tags, type } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title || !type) {
      return res.status(400).json({ message: "Missing title or type" });
    }

    if (!["image", "video"].includes(type)) {
      return res.status(400).json({ message: "Invalid media type" });
    }

    const media = new Media({
      title,
      tags: tags ? tags.split(",") : [],
      type,
      cloudUrl: `/uploads/${req.file.filename}`
    });

    await media.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ==========================
// PUBLIC INDEX (LAST)
// ==========================
app.get("/", (req, res) => {
  res.send("Public site OK");
});

// ==========================
// START SERVER
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
