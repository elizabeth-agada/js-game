const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('Typing Game API');
});

// Import the Score model
const Score = require('./models/Score');

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
