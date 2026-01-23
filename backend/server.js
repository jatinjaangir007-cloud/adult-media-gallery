import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/admin.js";
import publicRoutes from "./routes/public.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* ==============================
   PATH FIX (IMPORTANT)
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ==============================
   MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   SERVE FRONTEND (THE BIG FIX)
================================ */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ==============================
   ROUTES
================================ */
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

/* ==============================
   FRONTEND PAGES
================================ */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

/* ==============================
   DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

/* ==============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
