const mongoose = require('mongoose');
const Course = require('../models/course');

const courses = [
  {
    _id: "technical",
    title: "Technical Analysis",
    instructor: "SVS Karthik",
    totalModules: 10,
    completedModules: 0,
    description: "Learn technical analysis.",
    thumbnail: "technicalanalysis.jpg",
    videos: [
      {
        id: "tech-1",
        title: "Introduction to Technical Analysis",
        description: "Overview of technical analysis.",
        duration: "10:30",
        videoUrl: "https://www.youtube.com/embed/Xn7KWR9EOGQ"
      },
      {
        id: "tech-2",
        title: "Chart Patterns & Indicators",
        description: "Learn about chart patterns.",
        duration: "12:00",
        videoUrl: "https://www.youtube.com/embed/QIIkdQxagdA"
      }
    ]
  },
  {
    _id: "fundamental",
    title: "Fundamental Analysis",
    instructor: "SVS Karthik",
    totalModules: 8,
    completedModules: 0,
    description: "Learn fundamental analysis.",
    thumbnail: "fa.jpg",
    videos: [
      {
        id: "fund-1",
        title: "Introduction to Fundamental Analysis",
        description: "Overview of fundamental analysis.",
        duration: "14:05",
        videoUrl: "https://www.youtube.com/embed/PQqfeyUQbyE"
      },
      {
        id: "fund-2",
        title: "Earnings Reports Explained",
        description: "Understanding earnings reports.",
        duration: "09:48",
        videoUrl: "https://www.youtube.com/embed/_FzLo1BmP4Q"
      }
    ]
  },
  {
    _id: "commodity",
    title: "Commodity Trading",
    instructor: "SVS Karthik",
    totalModules: 12,
    completedModules: 0,
    description: "Learn commodity trading.",
    thumbnail: "ct.jpg",
    videos: [
      {
        id: "comm-1",
        title: "Introduction to Commodity Trading",
        description: "Overview of commodity trading.",
        duration: "11:40",
        videoUrl: "https://www.youtube.com/embed/KGutk0fC3XE"
      },
      {
        id: "comm-2",
        title: "Commodity Market Strategies",
        description: "Commodity market strategies explained.",
        duration: "09:30",
        videoUrl: "https://www.youtube.com/embed/sample_commodity2"
      }
    ]
  },
  {
    _id: "forex",
    title: "Futures & Options",
    instructor: "SVS Karthik",
    totalModules: 10,
    completedModules: 0,
    description: "Learn features and options.",
    thumbnail: "c&c2 (2).jpg",
    videos: [
      {
        id: "forex-1",
        title: "Introduction to Features & Options 1",
        description: "Intro to F&O.",
        duration: "08:15",
        videoUrl: "https://www.youtube.com/embed/LRgWGsrzMAU"
      },
      {
        id: "forex-2",
        title: "Introduction to Features & Options 2",
        description: "Advanced features and options.",
        duration: "07:45",
        videoUrl: "https://www.youtube.com/embed/nNX51v-Ve5g"
      }
    ]
  }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Candles';

async function seedCourses() {
  try {
    await mongoose.connect(MONGODB_URI, {});
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('✅ Demo courses seeded successfully!');
  } catch (err) {
    console.error('❌ Error seeding courses:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedCourses();