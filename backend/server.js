import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MUST HAVE (this was missing earlier)
app.use(express.json());

// ✅ Frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Admin API
app.use("/admin", adminRoutes);

// ✅ Routes for HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});
app.get("/admin/dashboard", (req, res) => {
  res.sendFile(
    path.join(process.cwd(), "frontend", "admin-dashboard.html")
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
