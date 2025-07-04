const mongoose = require('mongoose');
var Schema =   mongoose.Schema;

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String
  },
  courseId: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'courses'
  }],
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String
  },
  status: {
    type: Boolean,
    default: true // true = inactive/offline, false = active/online
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  },
  lastLogoutAt: {
    type: Date
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
