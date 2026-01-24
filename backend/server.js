import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";
import mediaRoutes from "./routes/media.js";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// REQUIRED
app.use(express.json());

// ✅ Serve frontend correctly
app.use(express.static(path.join(__dirname, "../frontend")));

// APIs
app.use("/admin", adminRoutes);
app.use("/media", mediaRoutes);

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

app.get("/admin/dashboard", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/admin-dashboard.html")
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
