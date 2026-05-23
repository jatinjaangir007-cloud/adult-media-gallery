import 'dotenv/config';
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import adminAuthRoutes  from './routes/adminAuth.js';
import adminMediaRoutes from './routes/adminMedia.js';
import adminAdsRoutes   from './routes/adminAds.js';
import adminCamsRoutes  from './routes/adminCams.js';
import publicMediaRoutes from './routes/publicMedia.js';
import publicExtrasRoutes from './routes/publicExtras.js';

const app = express();
const PORT = process.env.PORT || 10000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Static folders ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- API routes ----------
app.use('/api/admin',        adminAuthRoutes);
app.use('/api/admin/media',  adminMediaRoutes);
app.use('/api/admin/ads',    adminAdsRoutes);
app.use('/api/admin/cams',   adminCamsRoutes);
app.use('/api/public/media', publicMediaRoutes);
app.use('/api/public',       publicExtrasRoutes);

// ---------- ADMIN PAGES ----------
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin-dashboard.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/view.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/categories.html'));
});

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
