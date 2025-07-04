const Enrollment = require('../models/enrol');
const Course = require('../models/course');
const User = require('../models/User'); // Adjust the path as needed

// List of static courses (should match frontend)
const staticCourses = {
  'technical': {
    id: 'technical',
    title: 'Technical Analysis',
    instructor: 'SVS Karthik',
    totalModules: 10,
    completedModules: 0,
    description: '',
    thumbnail: './src/Assets/technical analysis.jpg'
  },
  'fundamental': {
    id: 'fundamental',
    title: 'Fundamental Analysis',
    instructor: 'SVS Karthik',
    totalModules: 8,
    completedModules: 0,
    description: '',
    thumbnail: './src/Assets/fa.jpg'
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
    title: 'Futures & Options',
    instructor: 'SVS Karthik',
    totalModules: 10,
    completedModules: 0,
    description: '',
    thumbnail: './src/Assets/forex.jpg'
  }
};

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  // const {
  //   userId,
  //   courseId,
  //   courseName,
  //   // totalModules,
  //   // instructor,
  //   // thumbnail
  // } = req.body;
console.log('reqq',req.body)
  // if (!userId || !courseId || !courseName) {
  //   return res.status(400).json({
  //     success: false,
  //     message: 'Missing required fields: userId, courseId, and courseName are required'
  //   });
  // }

  // try {
  //   // Check if already enrolled
  //   const existingEnrollment = await User.findOne({courseId: courseId });
  //   if (existingEnrollment) {
  //     return res.status(400).json({
  //       success: false,
  //       message: 'User already enrolled in this course'
  //     });
  //   }

  //   // Get course details (static or DB)
  //   let course = staticCourses[courseId];
  //   if (!course) {
  //     course = await Course.findById(courseId).lean();
  //     if (!course) {
  //       return res.status(404).json({
  //         success: false,
  //         message: `Course with ID ${courseId} not found`
  //       });
  //     }
  //   }

  //   // Create new enrollment with all required fields
  //   const enrollment = new User({
  //     courseId: courseId
  //     // userId,
  //     // courseId,
  //     // courseName,
  //     // completedModules: 0, // ALWAYS start from 0
  //     // totalModules: totalModules || course.totalModules || 1,
  //     // instructor: instructor || course.instructor || 'Instructor',
  //     // thumbnail: thumbnail || course.thumbnail || '',
  //     // progress: 0,
  //     // enrollmentDate: new Date(),
  //     // status: 'active',
  //     // hasVideoAccess: false // <-- Default: no access to videos until admin grants
  //   });

  //   await enrollment.save();

  //   console.log('New enrollment created:', enrollment);

  //   res.status(201).json({
  //     success: true,
  //     message: 'Enrolled successfully',
  //     enrollment
  //   });
  // } catch (error) {
  //   console.error('Error enrolling in course:', error);
  //   res.status(500).json({
  //     success: false,
  //     message: 'Server error: Failed to enroll',
  //     error: error.message
  //   });
  // }
};

// Get enrolled courses for a user
exports.getEnrolledCourses = async (req, res) => {
  const { uid } = req.params;

  // try {
  //   // Fetch enrollments
  //   const enrollments = await Enrollment.find({ userId: uid, status: 'active' }).lean();

  //   console.log('Raw enrollments from DB:', enrollments);

  //   const courseIds = enrollments.map(enrollment => enrollment.courseId);

  //   // Fetch DB courses
  //   const dbCourses = await Course.find({
  //     _id: { $in: courseIds.filter(id => !staticCourses[id]) }
  //   }).lean();

  //   // Process enrolled courses
  //   const enrolledCourses = enrollments.map(enrollment => {
  //     let course;
  //     if (staticCourses[enrollment.courseId]) {
  //       course = staticCourses[enrollment.courseId];
  //     } else {
  //       course = dbCourses.find(c => c._id.toString() === enrollment.courseId);
  //     }

  //     // Ensure proper data structure
  //     const courseData = {
  //       id: course?.id || course?._id?.toString() || enrollment.courseId,
  //       title: course?.title || enrollment.courseName,
  //       description: course?.description || '',
  //       enrollmentDate: enrollment.enrollmentDate,
  //       enrolledAt: enrollment.enrollmentDate,
  //       status: enrollment.status,
  //       instructor: enrollment.instructor || course?.instructor || 'Unknown Instructor',
  //       thumbnail: enrollment.thumbnail || course?.thumbnail || '',
  //       totalModules: enrollment.totalModules || course?.totalModules || 1,
  //       completedModules: enrollment.completedModules || 0, // Ensure 0 if undefined
  //       progress: enrollment.progress || 0,
  //       hasVideoAccess: enrollment.hasVideoAccess ?? false // <-- Include this flag
  //     };

  //     console.log('Processed course data:', courseData);
  //     return courseData;
  //   });

  //   console.log('Final enrolled courses:', enrolledCourses);

  //   res.status(200).json({
  //     success: true,
  //     courses: enrolledCourses
  //   });
  // } catch (error) {
  //   console.error('Error fetching enrolled courses:', error);
  //   res.status(500).json({
  //     success: false,
  //     message: 'Server error: Failed to fetch enrolled courses',
  //     error: error.message
  //   });
  // }

  try{
  const coursesData = await Course.find({}).lean();
   res.status(200).json({
      success: true,
      courses: coursesData
    });
  }catch(error){
   res.status(500).json({
      success: false,
      message: 'Server error: Failed to fetch enrolled courses',
      error: error.message
    });

  }
};

// Admin: Grant or revoke video access for an enrollment
exports.setVideoAccess = async (req, res) => {
  const { enrollmentId } = req.params;
  const { hasVideoAccess } = req.body;

  if (typeof hasVideoAccess !== 'boolean') {
    return res.status(400).json({ success: false, message: 'hasVideoAccess must be a boolean' });
  }

  try {
    const updated = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { hasVideoAccess },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.json({ success: true, enrollment: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get a user's enrollment for a course (to check access)
exports.getEnrollmentForUserCourse = async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const enrollment = await Enrollment.findOne({ userId, courseId }).lean();
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all enrollments (admin only)

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate('userId', 'email fullName').lean();

    // Flatten output for table display
      const enrollmentsWithUser = enrollments.map(e => ({
        id: e._id,
        userId: e.userId?._id || e.userId, // for reference
        fullName: e.userId?.fullName || "Unknown",
        userEmail: e.userId?.email || "NA",
        courseId: e.courseId,
        courseName: e.courseName,
        enrollmentDate: e.enrollmentDate,
        status: e.status,
        progress: e.progress,
        completedModules: e.completedModules,
        totalModules: e.totalModules,
        hasVideoAccess: e.hasVideoAccess ?? false ,
        instructor: e.instructor,
        thumbnail: e.thumbnail
        // Add other fields as needed
      }));

    res.status(200).json({
      success: true,
      enrollments: enrollmentsWithUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
console.log('comming')

// try {
//   const resp = await User.aggregate([
//     {
//       $lookup: {
//         from: 'enrollments',
//         localField: 'course', // you probably want to match on userId
//         foreignField: '_id',
//         as: 'usersData'
//       }
//     }
//     // You can uncomment and clean your projection/grouping logic here
//   ]);

//   res.send({ Status: "Success", data: resp });

// } catch (err) {
//   console.error(err);
//   res.send({ Status: "Failed", msg: "Error occurred while getting enrollments" });
// }
};