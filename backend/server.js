import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import adminMediaRoutes from './routes/adminMedia.js';

// ------------------------------------------------------------------
// ESM dirname fix
// ------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------------------
// App setup
// ------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
}));

// IMPORTANT: DO NOT use express.json() for video uploads
// It causes memory overflow for large files
app.use(express.urlencoded({ extended: false }));

// ------------------------------------------------------------------
// Static folders
// ------------------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.use('/api/admin/media', adminMediaRoutes);

// ------------------------------------------------------------------
// Health check
// ------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ------------------------------------------------------------------
// Start server
// ------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
