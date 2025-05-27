const Enrollment = require('../models/enrol');

// Enroll a user in a course
exports.enrollInCourse = async (req, res) => {
  try {
    const { userId, courseId, courseName } = req.body;

    if (!userId || !courseId || !courseName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if user is already enrolled in this course
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'User is already enrolled in this course'
      });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      courseName
    });

    await enrollment.save();

    // Get all courses the user is enrolled in
    const userEnrollments = await Enrollment.find({ userId });
    const enrolledCourseIds = userEnrollments.map(enrollment => enrollment.courseId);

    return res.status(201).json({
      success: true,
      message: `Successfully enrolled in "${courseName}"`,
      enrolledCourses: enrolledCourseIds
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while enrolling in course',
      error: error.message
    });
  }
};

// Get enrolled courses for a user
exports.getEnrolledCourses = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find all enrollments for this user
    const enrollments = await Enrollment.find({ userId: uid });
    
    // Extract just the course IDs for the frontend
    const enrolledCourseIds = enrollments.map(enrollment => enrollment.courseId);

    return res.status(200).json({
      success: true,
      enrolledCourses: enrolledCourseIds,
      courseDetails: enrollments
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses',
      error: error.message
    });
  }
};
