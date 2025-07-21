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

   // Enroll Courses...

exports.enrollInCourse = async (req, res) => {
  const {
    userId,
    email,
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

    //  Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      courseName,
      completedModules: 0,
      totalModules: totalModules || 1,
      instructor: instructor || 'Instructor',
      thumbnail: thumbnail || '',
      progress: 0,
      enrollmentDate: new Date(),
      status: 'active',
      hasVideoAccess: false
    });

    await enrollment.save();

    // ✅ Optional: update user’s enrolled course list
    await User.updateOne(
      { email },
      { $addToSet: { courseId: courseId } }
    );

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
  console.log('cominggggggg')
  const { uid } = req.params.uid;
   try {
  const result = await User.aggregate([
     { "$match": { "email":req.params.uid} },
     { $unwind: { path: "$courseId", preserveNullAndEmptyArrays: true } },
        {$project :
            {
              "_id":1,
              "courseId":1,
              "fullName":1,
              "phoneNumber":1,
              "email":1,
              'videoAccess':1
            }
        },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course_info"
      }
    },
    {
      $unwind: {
        path: "$course_info"
      }
    },
    {
      $project: {
        _id: 1,
        'videoAccess':1,
      //  "fullName":1,
      //   "phoneNumber":1,
      //   "email":1,
        'courseId': '$course_info._id',
        'courseName': '$course_info.title',
        'courseDescription': '$course_info.description',
        'courseInstructor': '$course_info.instructor',
        'videos': '$course_info.videos',
      }
    }
  ]);
// console.log('result', result);
  if (result.length !== 0) {
    res.json({
      error: false,
      Status: "Success",
      data: result,
      msg: "Success"
    });
  } else {
    res.send({ Status: "Success", data: [] });
  }
} catch (e) {
  console.log('ee', e);
  res.send({ Status: "Failed", msg: "Problem while sending the data" });
}

};

exports.getUserAccessedCourses = async (req, res) => {
  console.log('cominggggggg')
  const { uid } = req.params.uid;
   try {
  const result = await User.aggregate([
     { "$match": { "email":req.params.uid, 'videoAccess':true} },
     { $unwind: { path: "$courseId", preserveNullAndEmptyArrays: true } },
        {$project :
            {
              "_id":1,
              "courseId":1,
              "fullName":1,
              "phoneNumber":1,
              "email":1,
            }
        },
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course_info"
      }
    },
    {
      $unwind: {
        path: "$course_info"
      }
    },
    {
      $project: {
        _id: 1,
      //  "fullName":1,
      //   "phoneNumber":1,
      //   "email":1,
        'courseId': '$course_info._id',
        'courseName': '$course_info.title',
        'courseDescription': '$course_info.description',
        'courseInstructor': '$course_info.instructor',
        'videos': '$course_info.videos'
      }
    }
  ]);
// console.log('result', result);
  if (result.length !== 0) {
    res.json({
      error: false,
      Status: "Success",
      data: result,
      msg: "Success"
    });
  } else {
    res.send({ Status: "Success", data: [] });
  }
} catch (e) {
  console.log('ee', e);
  res.send({ Status: "Failed", msg: "Problem while sending the data" });
}

};

// Admin: Grant or revoke video access for an enrollment
exports.setVideoAccess = async (req, res) => {
  console.log('setVideoAccess called', req.body);

  const { enrollmentId } = req.params;
  const { hasVideoAccess } = req.body;
  console.log('enrollmentId:', enrollmentId);

  if (typeof hasVideoAccess !== 'boolean') {
    return res.status(400).json({ success: false, message: 'hasVideoAccess must be a boolean' });
  }

  try {
    const updated = await User.findByIdAndUpdate(
      enrollmentId,
      { videoAccess: hasVideoAccess },
      { new: true } // return the updated document
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'Successfully updated user', user: updated });
  } catch (error) {
    console.error('Error updating video access:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
  // try {
  //   const enrollments = await Enrollment.find().populate('userId', 'email fullName').lean();

  //   // Flatten output for table display
  //     const enrollmentsWithUser = enrollments.map(e => ({
  //       id: e._id,
  //       userId: e.userId?._id || e.userId, // for reference
  //       fullName: e.userId?.fullName || "Unknown",
  //       userEmail: e.userId?.email || "NA",
  //       courseId: e.courseId,
  //       courseName: e.courseName,
  //       enrollmentDate: e.enrollmentDate,
  //       status: e.status,
  //       progress: e.progress,
  //       completedModules: e.completedModules,
  //       totalModules: e.totalModules,
  //       hasVideoAccess: e.hasVideoAccess ?? false ,
  //       instructor: e.instructor,
  //       thumbnail: e.thumbnail
  //       // Add other fields as needed
  //     }));

  //   res.status(200).json({
  //     success: true,
  //     enrollments: enrollmentsWithUser
  //   });
  // } catch (error) {
  //   res.status(500).json({ success: false, message: 'Server error', error: error.message });
  // }
console.log('comming')

try {
  const resp = await User.aggregate([
    { $match: {} },
    {
      $project: {
        _id: 1,
        courseId: 1,
        fullName: 1,
        phoneNumber: 1,
        email: 1,
        videoAccess:1
      }
    },
    { $unwind: { path: "$courseId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course_info'
      }
    },
    { $unwind: { path: "$course_info" } },
    {
      $project: {
        _id: 1,
        fullName: 1,
        phoneNumber: 1,
        email: 1,
        videoAccess:1,
        courseId: "$course_info._id",
        courseName: "$course_info.title"
      }
    },
    {
      $group: {
        _id: "$_id",
        fullName: { $first: "$fullName" },
        phoneNumber: { $first: "$phoneNumber" },
        email: { $first: "$email" },
        videoAccess: { $first: "$videoAccess" },
        courses: {
          $push: {
            courseId: "$courseId",
            courseName: "$courseName"
          }
        }
      }
    }
  ]);

  res.send({ Status: "Success", data: resp });

} catch (err) {
  console.error(err);
  res.send({ Status: "Failed", msg: "Error occurred while getting enrollments" });
}

};

