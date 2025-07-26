import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  res.json({ message: `Hello user ${req.user.id}, you accessed protected data!` });
});

export default router;
