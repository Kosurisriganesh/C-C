const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  }, // Not required for Google users
  isAdmin: {
    type: Boolean,
    default: false
  },
  googleId: { type: String },
  date: { 
    type: Date, 
    default: Date.now },

  status: { 
    type: Boolean, 
    default: false   
  } 
  // false means not verified, true means verified
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);