import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/admin.js";
import publicRoutes from "./routes/public.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse JSON
app.use(express.json());

// ✅ CORRECT FRONTEND PATH (go one level UP)
const frontendPath = path.join(__dirname, "..", "frontend");

// ✅ Serve static files
app.use(express.static(frontendPath));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

// Admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(frontendPath, "admin.html"));
});

// Public site
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
