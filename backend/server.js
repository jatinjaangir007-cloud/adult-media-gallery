require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const path = require("path");

const Media = require("./models/Media");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- CLOUDINARY ---------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

/* ---------------- MULTER ---------------- */
const upload = multer({ storage: multer.memoryStorage() });

/* ---------------- AUTH ---------------- */
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  try {
    jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

/* ---------------- ADMIN LOGIN ---------------- */
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

/* ---------------- ADMIN UPLOAD ---------------- */
app.post(
  "/api/admin/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file" });

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "velvethub" },
          (err, uploadResult) => {
            if (err) reject(err);
            else resolve(uploadResult);
          }
        ).end(req.file.buffer);
      });

      const media = new Media({
        title: req.body.title,
        tags: req.body.tags?.split(",").map(t => t.trim()) || [],
        url: result.secure_url,
        type: result.resource_type,
      });

      await media.save();
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ---------------- PUBLIC API ---------------- */
app.get("/api/media", async (req, res) => {
  const q = req.query.q || "";
  const media = await Media.find({
    $or: [
      { title: new RegExp(q, "i") },
      { tags: new RegExp(q, "i") },
    ],
  }).sort({ createdAt: -1 });

  res.json(media);
});

/* ---------------- STATIC FILES ---------------- */
const PUBLIC_PATH = path.join(__dirname, "../frontend/public");
app.use(express.static(PUBLIC_PATH));

/* ✅ ADMIN PAGE (MUST BE BEFORE *) */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "admin.html"));
});

/* ✅ PUBLIC SITE */
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

/* ---------------- START ---------------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
