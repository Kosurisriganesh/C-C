const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrolcontrol');

// POST /api/enrollments/enroll
router.post('/enroll', enrollmentController.enrollInCourse);

// GET /api/enrollments/users/:uid/enrolled-courses
router.get('/users/:uid/enrolled-courses', enrollmentController.getEnrolledCourses);

module.exports = router;