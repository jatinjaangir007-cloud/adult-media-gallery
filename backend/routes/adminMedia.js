import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import { v2 as cloudinary } from 'cloudinary';
import auth from '../middleware/auth.js';
import Media from '../models/Media.js';

const router = express.Router();

// ================= CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================= MULTER (memory, no disk) =================
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/webm', 'video/quicktime'
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type. Only images and videos allowed.'));
  }
});

// ================= HELPER =================
function streamUpload(buffer, resourceType) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'velvethub' },
      (err, result) => err ? reject(err) : resolve(result)
    );
    Readable.from(buffer).pipe(stream);
  });
}

// ================= UPLOAD (POST) =================
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, tags } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const result = await streamUpload(req.file.buffer, fileType);

    const media = await Media.create({
      title,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      fileType,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    res.json({ success: true, media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// ================= LIST ALL (GET) =================
router.get('/', auth, async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// ================= EDIT (PUT) =================
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, tags } = req.body;
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { title, tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [] },
      { new: true }
    );
    if (!media) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, media });
  } catch (err) {
    res.status(500).json({ error: 'Edit failed' });
  }
});

// ================= DELETE (DELETE) =================
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Not found' });

    if (media.cloudinaryId) {
      await cloudinary.uploader.destroy(media.cloudinaryId, {
        resource_type: media.fileType === 'video' ? 'video' : 'image'
      });
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
