import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  position: {
    type: String,
    enum: ['header', 'after-row-1', 'after-row-3', 'sidebar', 'footer', 'popup'],
    required: true
  },
  code:    { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  clicks:  { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Ad', adSchema);
