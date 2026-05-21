import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tags: [String],
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    cloudinaryId: { type: String, default: '' }
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
