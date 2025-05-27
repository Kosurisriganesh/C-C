const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    enum: ['user', 'admin'],   // Only allow 'user' or 'admin'
    default: 'admin'            // Default role is 'user'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Prevent model overwrite error in development
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
