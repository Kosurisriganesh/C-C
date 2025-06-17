const Enrollment = require('../models/enrol');
const Course = require('../models/course');

// List of static courses (should match frontend)
const staticCourses = {
  'technical': {
    id: 'technical',
    title: 'Technical Analysis',
    instructor: 'SVS Karthik',
    totalModules: 10,
    completedModules: 0,
    description: '',
    thumbnail:  './src/Assets/technical analysis.jpg'
  },
  'fundamental': {
    id: 'fundamental',
    title: 'Fundamental Analysis',
    instructor: 'SVS Karthik',
    totalModules: 8,
    completedModules: 0,
    description: '',
    thumbnail:  './src/Assets/fa.jpg'
  },
  'commodity': {
    id: 'commodity',
    title: 'Commodity Trading',
    instructor: 'SVS Karthik',
    totalModules: 12,
    completedModules: 0,
    description: '',
    thumbnail: './src/Assets/ct.jpg'
  },
  'forex': {
    id: 'forex',
    title: 'Features & Options',
    instructor: 'SVS Karthik',
    totalModules: 10,
    completedModules: 0,
    description: '',
    thumbnail:  './src/Assets/forex.jpg'
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  const { 
    userId, 
    courseId, 
    courseName, 
    totalModules, 
    instructor, 
    thumbnail 
  } = req.body;

  if (!userId || !courseId || !courseName) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: userId, courseId, and courseName are required' 
    });
  }

  try {
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already enrolled in this course' 
      });
    }

    // Get course details (static or DB)
    let course = staticCourses[courseId];
    if (!course) {
      course = await Course.findById(courseId).lean();
      if (!course) {
        return res.status(404).json({ 
          success: false, 
          message: `Course with ID ${courseId} not found` 
        });
      }
    }

    // Create new enrollment with all required fields
    const enrollment = new Enrollment({
      userId,
      courseId,
      courseName,
      completedModules: 0, // ALWAYS start from 0
      totalModules: totalModules || course.totalModules || 1,
      instructor: instructor || course.instructor || 'Instructor',
      thumbnail: thumbnail || course.thumbnail || '',
      progress: 0,
      enrollmentDate: new Date(),
      status: 'active'
    });

    await enrollment.save();
    
    console.log('New enrollment created:', enrollment);
    
    res.status(201).json({ 
      success: true, 
      message: 'Enrolled successfully', 
      enrollment 
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: Failed to enroll', 
      error: error.message 
    });
  }
};

// Get enrolled courses for a user
exports.getEnrolledCourses = async (req, res) => {
  const { uid } = req.params;

  try {
    // Fetch enrollments
    const enrollments = await Enrollment.find({ userId: uid, status: 'active' }).lean();
    
    console.log('Raw enrollments from DB:', enrollments);
    
    const courseIds = enrollments.map(enrollment => enrollment.courseId);

    // Fetch DB courses
    const dbCourses = await Course.find({ 
      _id: { $in: courseIds.filter(id => !staticCourses[id]) } 
    }).lean();

    // Process enrolled courses
    const enrolledCourses = enrollments.map(enrollment => {
      let course;
      if (staticCourses[enrollment.courseId]) {
        course = staticCourses[enrollment.courseId];
      } else {
        course = dbCourses.find(c => c._id.toString() === enrollment.courseId);
      }

      // Ensure proper data structure
      const courseData = {
        id: course?.id || course?._id?.toString() || enrollment.courseId,
        title: course?.title || enrollment.courseName,
        description: course?.description || '',
        enrollmentDate: enrollment.enrollmentDate,
        enrolledAt: enrollment.enrollmentDate,
        status: enrollment.status,
        instructor: enrollment.instructor || course?.instructor || 'Unknown Instructor',
        thumbnail: enrollment.thumbnail || course?.thumbnail || '',
        totalModules: enrollment.totalModules || course?.totalModules || 1,
        completedModules: enrollment.completedModules || 0, // Ensure 0 if undefined
        progress: enrollment.progress || 0
      };

      console.log('Processed course data:', courseData);
      return courseData;
    });

    console.log('Final enrolled courses:', enrolledCourses);

    res.status(200).json({ 
      success: true, 
      courses: enrolledCourses 
    });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: Failed to fetch enrolled courses', 
      error: error.message 
    });
  }
};