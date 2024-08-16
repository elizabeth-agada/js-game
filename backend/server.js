// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sendEmail = require('./services/emailService'); // Correct path
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define models
const User = require('./models/User');
const Score = require('./models/Score');

// Register a new user
app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      verificationToken: crypto.randomBytes(32).toString('hex'),
      isVerified: false
    });

    await newUser.save();

    // Send verification email
    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${newUser.verificationToken}`;
    await sendEmail(email, 'Verify your email', `Please verify your email by clicking the following link: ${verificationLink}`);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify email
app.get('/api/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Log in a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a new score
app.post('/api/score', async (req, res) => {
  const { username, score } = req.body;
  try {
    const newScore = new Score({ username, score });
    await newScore.save();
    res.json(newScore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
