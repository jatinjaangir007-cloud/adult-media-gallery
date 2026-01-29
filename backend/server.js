import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import adminMediaRoutes from "./routes/adminMedia.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import publicMediaRoutes from "./routes/publicMedia.js";

const app = express();
const PORT = process.env.PORT || 10000;

// required for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, "../frontend")));

// ===== ADMIN PAGES =====
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-dashboard.html"));
});

// ===== API ROUTES =====
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/media", adminMediaRoutes);
app.use("/api/public", publicMediaRoutes);

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
