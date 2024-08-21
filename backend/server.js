const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Models
const User = require('./models/User');
const Score = require('./models/Score'); // Ensure you have the Score model defined

// Send email function
const sendEmail = require('./services/emailService');

// Register User Route
app.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      verificationToken,
      isVerified: false
    });

    await newUser.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail(email, 'Verify your email', `Click this link to verify your email: ${verificationUrl}`);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User Route
app.get('/api/current-user', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: 'Error fetching current user' });
  }
});


// Email Verification Route
app.post('/api/verify-email', async (req, res) => {
  const { token } = req.body;
  console.log("Received token:", token);  // Log the received token

  try {
    const user = await User.findOne({ verificationToken: token });
    console.log("User found:", user);  // Log the user object or null if not found

    if (!user) {
      console.log("Token is invalid or expired.");  // Log when the token is invalid
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (user.isVerified) {
      console.log("User already verified");
      return res.status(400).json({ message: 'User already verified' });
    }

    user.isVerified = true;
    user.verificationToken = null; // Clear the token after verification
    await user.save();

    console.log("User verification status updated:", user.isVerified);  // Log the updated verification status

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error("Error during verification:", error);  // Log any errors that occur
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login Route
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

// Score Submission Route
app.post('/api/scores', async (req, res) => {
  const { score } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const newScore = new Score({
      user: userId,
      score,
    });

    await newScore.save();
    res.status(201).json({ message: 'Score submitted successfully' });
  } catch (error) {
    console.error("Error submitting score:", error); // Log the error
    res.status(500).json({ message: 'Error submitting score' });
  }
});

// Get Leaderboard Route
app.get('/api/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('user', 'username') // Fetch the username from the User model
      .sort({ score: -1 })
      .limit(10);

    res.json(scores);
  } catch (error) {
    console.error("Error fetching leaderboard:", error); // Log the error
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
