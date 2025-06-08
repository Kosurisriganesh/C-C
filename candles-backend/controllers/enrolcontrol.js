const Enrollment = require('../models/enrol');
const Course = require('../models/course');

// List of static courses (should match frontend)
const staticCourses = {
  'technical': {
    id: 'technical',
    title: 'Technical Analysis',
    instructor: 'John Smith',
    totalModules: 10,
    completedModules: 4,
    description: '',
    thumbnail: process.env.PUBLIC_URL + '/technical analysis.jpg'
  },
  'fundamental': {
    id: 'fundamental',
    title: 'Fundamental Analysis',
    instructor: 'Sarah Johnson',
    totalModules: 8,
    completedModules: 2,
    description: '',
    thumbnail: process.env.PUBLIC_URL + '/fa.jpg'
  },
  'commodity': {
    id: 'commodity',
    title: 'Commodity Trading',
    instructor: 'Michael Chen',
    totalModules: 12,
    completedModules: 9,
    description: '',
    thumbnail: process.env.PUBLIC_URL + '/ct.jpg'
  },
  'forex': {
    id: 'forex',
    title: 'Features & Options',
    instructor: 'Alex Wong',
    totalModules: 10,
    completedModules: 3,
    description: '',
    thumbnail: process.env.PUBLIC_URL + '/c&c2 (2).jpg'
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  const { userId, courseId, courseName } = req.body;

  if (!userId || !courseId || !courseName) {
    return res.status(400).json({ success: false, message: 'Missing required fields: userId, courseId, and courseName are required' });
  }

  try {
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'User already enrolled in this course' });
    }

    // Check if course exists (static or DB)
    let course = staticCourses[courseId];
    let isStatic = !!course;
    if (!course) {
      course = await Course.findById(courseId).lean();
      if (!course) {
        return res.status(404).json({ success: false, message: `Course with ID ${courseId} not found` });
      }
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      courseName,
      enrollmentDate: new Date(),
      status: 'active',
    });

    await enrollment.save();
    res.status(201).json({ success: true, message: 'Enrolled successfully', enrollment });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ success: false, message: 'Server error: Failed to enroll', error: error.message });
  }
};

// Get enrolled courses for a user (for dashboard)
exports.getEnrolledCourses = async (req, res) => {
  const { uid } = req.params;

  try {
    // Fetch enrollments
    const enrollments = await Enrollment.find({ userId: uid, status: 'active' }).lean();
    const courseIds = enrollments.map(enrollment => enrollment.courseId);

    // Fetch DB courses
    const dbCourses = await Course.find({ _id: { $in: courseIds.filter(id => !staticCourses[id]) } }).lean();

    // Merge enrollment and course data
    const enrolledCourses = enrollments.map(enrollment => {
      let course;
      if (staticCourses[enrollment.courseId]) {
        course = staticCourses[enrollment.courseId];
      } else {
        course = dbCourses.find(c => c._id.toString() === enrollment.courseId);
      }
      return {
        id: course?.id || course?._id?.toString() || enrollment.courseId,
        title: course?.title || enrollment.courseName,
        description: course?.description || '',
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
        instructor: course?.instructor || 'Unknown Instructor',
        thumbnail: course?.thumbnail || process.env.PUBLIC_URL + '/c&c2 (2).jpg',
        totalModules: course?.totalModules || 10,
        completedModules: course?.completedModules || 0,
      };
    });

    res.status(200).json({ success: true, courses: enrolledCourses });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ success: false, message: 'Server error: Failed to fetch enrolled courses', error: error.message });
  }
};