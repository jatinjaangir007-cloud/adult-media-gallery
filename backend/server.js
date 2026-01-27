import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import adminAuthRoutes from './routes/adminauth.js';
import adminMediaRoutes from './routes/adminMedia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- middleware ---------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- API routes ---------------- */
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/media', adminMediaRoutes);

/* ---------------- static frontend ---------------- */
app.use(express.static(path.join(__dirname, '../frontend')));

/* ---------------- admin pages ---------------- */
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin-dashboard.html'));
});

/* ---------------- fallback ---------------- */
app.use((req, res) => {
  res.status(404).send('Not Found');
});

/* ---------------- start ---------------- */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
