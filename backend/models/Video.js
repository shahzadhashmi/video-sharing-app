// backend/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
