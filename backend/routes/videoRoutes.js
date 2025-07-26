// backend/routes/videoRoutes.js
import express from 'express';
import multer from 'multer';
import Video from '../models/Video.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Set up multer for video upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000 * 1000 * 50 }, // 50MB limit
  fileFilter(req, file, cb) {
    const isVideo = file.mimetype.startsWith('video/');
    if (!isVideo) {
      return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
  },
});

// @route GET /api/videos
// @desc Get all videos (only for consumers)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const videos = await Video.find().populate('creator', 'username email');
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/videos
// @desc Upload a video (only for creators)
router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
  if (req.user.role !== 'creator') {
    return res.status(403).json({ message: 'Only creators can upload videos' });
  }

  try {
    const { title } = req.body;
    const video = new Video({
      title,
      videoUrl: `/uploads/${req.file.filename}`,
      creator: req.user._id,
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
});

export default router;
