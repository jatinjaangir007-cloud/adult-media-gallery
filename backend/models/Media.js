const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [{ type: String }],
  type: { type: String, enum: ['photo', 'video'], required: true },
  cloudUrl: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', mediaSchema);