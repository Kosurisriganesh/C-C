// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const Course = require('../models/course'); // Import the Course model

const { getRecommendedCourses } = require('../controllers/courseControl');


const requireAdmin = (req, res, next) => {
  // TODO: Replace with real admin check later
  next();
};

/**
 * @route   POST /api/courses
 * @desc    Add a new course
 * @access  Public (for testing/admin, should be restricted in real app)
 */
router.post('/', async (req, res) => {
    const { title, description, price } = req.body;

    // Basic validation
    if (!title || !description || price === undefined || price === null) {
        return res.status(400).json({ msg: 'Please enter all fields: title, description, and price.' });
    }
    if (isNaN(price) || price < 0) {
        return res.status(400).json({ msg: 'Price must be a non-negative number.' });
    }

    try {
        // Create a new course instance
        const newCourse = new Course({ title, description, price });

        // Save the course to the database
        await newCourse.save();

        res.status(201).json({
            success: true,
            message: 'Course added successfully!',
            course: newCourse
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server error during course creation.',
            error: err.message
        });
    }
});

/**
 * @route   GET /api/courses/pdf
 * @desc    Get all courses pdf
 * @access  Public
 */

// PUT /api/courses/:courseId/videos/:videoId/pdf
router.put('/:courseId/videos/:videoId/pdf', requireAdmin, async (req, res) => {

  const { courseId, videoId } = req.params;
  const { pdfUrl } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const video = course.videos.find(v => v._id.toString() === videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.pdfUrl = pdfUrl;
    await course.save();

    res.json({ message: "PDF URL updated successfully", video });
  } catch (err) {
    console.error("PDF update error:", err);
    res.status(500).json({ error: "Failed to update PDF" });
  }
});


/**
 * @route   GET /api/courses
 * @desc    Get all courses
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            success: true,
            courses
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server error fetching courses.',
            error: err.message
        });
    }
});

// Recommended courses endpoint (now /api/courses/recommended)

router.get('/recommended-courses', getRecommendedCourses);


module.exports = router;
