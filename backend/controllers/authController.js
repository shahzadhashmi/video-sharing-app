// backend/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* ------------------------------------------------------------------ */
/* helper: build JWT                                                  */
/* ------------------------------------------------------------------ */
const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

/* ------------------------------------------------------------------ */
/* POST /api/auth/signup   (public – CONSUMER)                        */
/* ------------------------------------------------------------------ */
export const signupConsumer = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // prevent duplicate email
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'User already exists' });

    // hash pw and create user (role defaults to "consumer")
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashed });

    // (optional) auto‑login after signup:
    // const token = signToken(newUser._id, newUser.role);
    // return res.status(201).json({ token, user: { id: newUser._id, username, email } });

    // simple 201 response:
    res.status(201).json({ message: 'Consumer account created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/auth/login   (public)                                    */
/* ------------------------------------------------------------------ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id, user.role);

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ------------------------------------------------------------------ */
/* POST /api/auth/create-creator   (admin only)                       */
/* ------------------------------------------------------------------ */
export const createCreator = async (req, res) => {
  try {
    // req.user will exist if verifyAdmin middleware ran first
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const creator = await User.create({
      username,
      email,
      password: hashed,
      role: 'creator'
    });

    res.status(201).json({
      message: 'Creator account created',
      user: { id: creator._id, username: creator.username, email: creator.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
