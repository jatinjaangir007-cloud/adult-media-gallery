const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  tags: [{
    type: String,
    trim: true
  }],

  type: {
    type: String,
    enum: ['image', 'video'],   // ✅ FIX
    required: true
  },

  cloudUrl: {
    type: String,
    required: true              // ✅ Cloudinary URL
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', MediaSchema);
