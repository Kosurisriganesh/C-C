const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrolcontrol');

// Enroll in a course
router.post('/enroll', enrollmentController.enrollInCourse);

// Get enrolled courses for a user
router.get('/users/:uid/enrolled-courses', enrollmentController.getEnrolledCourses);

module.exports = router;
