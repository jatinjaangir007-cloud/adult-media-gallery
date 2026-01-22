import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Media from "./Media.js";

const app = express();
const PORT = process.env.PORT || 10000;

// ===== REQUIRED FOR ES MODULES =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILES =====
// frontend/public MUST be served as root
const PUBLIC_DIR = path.join(__dirname, "../frontend/public");
app.use(express.static(PUBLIC_DIR));

// ===== ROUTES =====

// Public homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "admin.html"));
});

// ===== API =====
app.post("/api/admin/upload", async (req, res) => {
  try {
    const { title, tags, cloudUrl, type } = req.body;

    if (!title || !cloudUrl || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const media = new Media({
      title,
      tags: tags ? tags.split(",") : [],
      cloudUrl,
      type
    });

    await media.save();
    res.json({ message: "Upload successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

// ===== START =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
