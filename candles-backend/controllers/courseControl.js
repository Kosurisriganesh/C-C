const Courses = require('../models/course');

exports.getRecommendedCourses = async (req, res) => {
  try {
    const courses = await Courses.find().lean();
    res.json({
      status: "Success",
      data: courses || []
    });
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
};