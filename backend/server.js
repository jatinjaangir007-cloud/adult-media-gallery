/* =========================
   Imports (ESM)
========================= */
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

/* =========================
   Route Imports
========================= */
import adminMediaRoutes from './routes/adminMedia.js';
import publicMediaRoutes from './routes/publicMedia.js';

/* =========================
   Config
========================= */
dotenv.config();
const app = express();

/* =========================
   __dirname for ESM
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   Middleware
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Static Files
========================= */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

/* =========================
   API Routes
========================= */

// admin upload / delete / list
app.use('/api/admin/media', adminMediaRoutes);

// public gallery fetch
app.use('/api/media', publicMediaRoutes);

/* =========================
   Frontend Routes
========================= */

// public site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// admin login
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// admin dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin-dashboard.html'));
});

/* =========================
   MongoDB
========================= */
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'adultMediaGallery'
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
