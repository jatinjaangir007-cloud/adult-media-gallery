import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import adminMediaRoutes from './routes/adminMedia.js';
import publicMediaRoutes from './routes/publicMedia.js';
import adminAuthRoutes from './routes/adminAuth.js';

dotenv.config();
const app = express();

/* ===== ESM dirname ===== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===== Middleware ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== Static ===== */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

/* ===== API ROUTES ===== */
app.use('/api/admin', adminAuthRoutes);      // ✅ LOGIN FIX
app.use('/api/admin/media', adminMediaRoutes);
app.use('/api/media', publicMediaRoutes);

/* ===== Pages ===== */
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/index.html'))
);

app.get('/admin', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/admin.html'))
);

app.get('/dashboard', (req, res) =>
  res.sendFile(path.join(__dirname, '../frontend/admin-dashboard.html'))
);

/* ===== Mongo ===== */
mongoose
  .connect(process.env.MONGO_URI, { dbName: 'adultMediaGallery' })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Mongo error', err));

/* ===== Server ===== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
