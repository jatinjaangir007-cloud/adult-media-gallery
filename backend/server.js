import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import adminAuthRoutes from "./routes/adminAuth.js";
import adminMediaRoutes from "./routes/adminMedia.js";
import publicMediaRoutes from "./routes/publicMedia.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Middleware ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Static folders ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../frontend")));

// ---------- API routes ----------
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/media", adminMediaRoutes);
app.use("/api/public/media", publicMediaRoutes);

// ---------- ADMIN PAGES ----------
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-dashboard.html"));
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
