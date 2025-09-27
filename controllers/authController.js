// controllers/authController.js
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // created below

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'; // set in env for prod
const JWT_EXPIRES = '7d';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = new User({ name, email, password, role });
    await user.save();

    logger.info(`User created: ${user.email}`);

    res.status(201).json({ message: 'User registered', user: { id: user._id, email: user.email, role: user.role }});
  } catch (err) {
    logger.error('Register error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed - email not found: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed - wrong password: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = { id: user._id, role: user.role, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    logger.info(`User logged in: ${email}`);

    res.json({ token, user: { id: user._id, email: user.email, role: user.role }});
  } catch (err) {
    logger.error('Login error', { error: err });
    res.status(500).json({ message: 'Server error' });
  }
};




