const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  // id: { type: String, required: false },
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
  }
}, { 
  _id: false 
});

const courseSchema = new mongoose.Schema({
  // _id: { type: String, required: false },
  title: { type: String, 
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
  }
});

module.exports = mongoose.model('Course', courseSchema, 'courses');