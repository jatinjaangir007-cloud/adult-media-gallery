const express = require('express');
const path = require('path');

const app = express();

// ✅ VERY IMPORTANT LIMITS
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// routes
const adminMediaRoutes = require('./routes/adminMedia');
app.use('/api/admin/media', adminMediaRoutes);

// health check
app.get('/', (req, res) => {
  res.send('Server running');
});

// ✅ PREVENT CRASHES
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
