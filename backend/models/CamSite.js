import mongoose from 'mongoose';

const camSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  description:  { type: String, default: '' },
  imageUrl:     { type: String, default: '' },
  affiliateUrl: { type: String, required: true },
  badge:        { type: String, default: 'LIVE' },
  enabled:      { type: Boolean, default: true },
  order:        { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('CamSite', camSchema);
