// backend/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Video from '../models/Video.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const video = new Video({
      title,
      url: `/uploads/${req.file.filename}`,
      creator: req.user._id,
    });

    await video.save();

    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

export default router;
