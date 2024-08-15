const mongoose = require('mongoose');

// Define the Score schema
const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create the Score model
const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
