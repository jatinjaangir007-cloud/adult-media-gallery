import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'uncategorized' },
    tags: [String],
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    cloudinaryId: { type: String, default: '' },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
