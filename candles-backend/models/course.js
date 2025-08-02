const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  duration: {
    type: String,
    default: ""
  },
  videoUrl: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    default: ""
  }
}, {
  _id: false
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  totalModules: {
    type: Number,
    default: 10
  },
  completedModules: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ""
  },
  thumbnail: {
    type: String,
    default: ""
  },
  videos: {
    type: [videoSchema],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
  // status: {
  //   type: String,
  //   enum: ['active', 'inactive'],
  //   default: 'active'
  // },
  // isRecommended: {
  //   type: Boolean,
  //   default: false
  // }
});

module.exports = mongoose.model('Course', courseSchema, 'courses');
