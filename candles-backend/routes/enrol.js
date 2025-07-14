const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrolcontrol');

// POST /api/enrollments/enroll
router.post('/enroll', enrollmentController.enrollInCourse);

// GET /api/enrollments/users/:uid/enrolled-courses
router.get('/users/:uid/enrolled-courses', enrollmentController.getEnrolledCourses);

// PATCH /api/enrollments/:enrollmentId/video-access (admin only)
router.patch('/:enrollmentId/video-access', enrollmentController.setVideoAccess);

// GET /api/enrollments/user/:userId/course/:courseId (check video access)
router.get('/user/:userId/course/:courseId', enrollmentController.getEnrollmentForUserCourse);

// GET /api/enrollments/all (admin only)
router.get('/all', enrollmentController.getAllEnrollments);

module.exports = router;