const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String },
  isVerified: { type: Boolean, default: false }
});

// Create a method to find user by ID
UserSchema.statics.findByIdWithScore = async function(userId) {
  return await this.findById(userId).populate('scores');
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
