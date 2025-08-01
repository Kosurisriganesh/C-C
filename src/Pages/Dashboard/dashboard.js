import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase';
import { signOut } from 'firebase/auth';
import './dashboard.css';
import profilepic from '../../Assets/profilepic.jpg';
import Footer from '../../Components/Footer/footer';
import Logo from '../../Assets/Logo2.png';

const API_BASE_URL = "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // Listen for auth state and set user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName ||
            (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
          email: firebaseUser.email || 'user@example.com',
          role: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'Google User' : 'Registered User',
          avatar: firebaseUser.photoURL || profilepic,
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null);
        setEnrolledCourses([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch enrolled courses from backend
  useEffect(() => {
    if (!user?.email) {
      setEnrolledCourses([]);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/api/enrollments/users/${user.email}/enrolled-courses`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(response => {
        console.log('Enrolled courses response:', response.data);
        setEnrolledCourses(response.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching enrolled courses:', error);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses/recommended-courses`, {
          credentials: 'include',
        });

        const response = await res.json();
        const allCourses = response?.data || [];

        // remove enrolled courses
        const enrolledIds = enrolledCourses.map(c => c.courseId?.toString());

        const filtered = allCourses.filter(
          course => !enrolledIds.includes(course._id?.toString())
        );

        setRecommendedCourses(filtered);
      } catch (error) {
        console.error('Error fetching recommended courses:', error);
      }
    };

    fetchRecommendedCourses();
  }, [enrolledCourses]);




  // Enroll in course using DB course info
  const enrollInCourse = async (courseId) => {
    if (!user) return;

    const courseDetails = recommendedCourses.find(
      c => (c._id || c.id) === courseId
    );

    if (!courseDetails) {
      alert("Course information not found.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/enrollments/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          courseId: courseDetails._id || courseDetails.id,
          courseName: courseDetails.title,
          completedModules: 0,
          totalModules: courseDetails.totalModules || 1,
          enrolledAt: new Date().toISOString(),
          instructor: courseDetails.instructor || 'Instructor',
          thumbnail: courseDetails.thumbnail || '',
          progress: 0
        })
      });

      const data = await res.json();
      console.log("Enrollment API response:", data); // optional debug

      if (data.success) {
        setEnrolledCourses(prev => [
          ...prev,
          {
            ...courseDetails,
            completedModules: 0,
            totalModules: courseDetails.totalModules || 1,
            enrolledAt: new Date().toISOString(),
            courseName: courseDetails.title,
            courseInstructor: courseDetails.instructor,
            id: courseDetails._id || courseDetails.id
          }
        ]);
        alert("Enrolled successfully!");
      } else {
        // ✅ Show specific alert if already enrolled
        if (data.message === "User already enrolled in this course") {
          alert("You have already enrolled in this course.");
        } else {
          alert(data.message || "Enrollment failed");
        }
      }
    } catch (e) {
      console.error('Enrollment error:', e);
      alert("Enrollment failed: " + e.message);
    }
  };


  const handleProfileClick = () => setShowProfileDropdown(!showProfileDropdown);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEnrolledCourses([]);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Dummy: you might want to use the first module/video id from the actual DB course structure
  const getCourseFirstVideo = (courseId) => '';

  if (loading) return <div className="loading-container">Loading...</div>;

  // Calculate progress - ensure 0% for new enrollments
  const courseProgress = {};
  enrolledCourses.forEach(course => {
    const completed = course.completedModules || 0;
    const total = course.totalModules || 1;
    courseProgress[course._id || course.id] = completed >= 0 ? Math.round((completed / total) * 100) : 0;
  });

  return (
    <div className='dashboard-container'>
      <nav className='dashboard-nav'>
        <div className="logo">
          <Link to="/home">
            <img src={Logo} alt="Candles" className="logo-image" />
          </Link>
          <h2> Candles & Capital </h2>
        </div>
        <ul className="nav-links">
          <li><Link to="/home"> HOME </Link></li>
          <li><Link to="/about"> ABOUT </Link></li>
          <li className="dropdown-container">
            <span><Link to="/Course"> COURSES </Link></span>
            <ul className="dropdown-menu">
              <li><Link to="/Course"> Technical Analysis </Link></li>
              <li><Link to="/Course"> Fundamental Analysis </Link></li>
              <li><Link to="/Course"> Commodity Trading </Link></li>
              <li><Link to="/Course"> Features & Option </Link></li>
            </ul>
          </li>
          <li><Link to="/Contact"> CONTACT </Link></li>
          {user ? (
            <li className="profile-container">
              <div className="profile-trigger" onClick={handleProfileClick}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                  }}
                />
                <span>{user.name}</span>
              </div>
              {showProfileDropdown && (
                <ul className="dropdown-menu profile-dropdown">
                  <li className="profile-header">
                    <strong>{user.name}</strong>
                    <span className="profile-role">{user.role}</span>
                  </li>
                  <li><Link to="/Profile" onClick={() => setShowProfileDropdown(false)}>My Profile</Link></li>
                  <li><Link to="/Course" onClick={() => setShowProfileDropdown(false)}>My Courses</Link></li>
                  <li className="logout-option" onClick={handleLogout}>Logout</li>
                </ul>
              )}
            </li>
          ) : (
            <li className="user-profile-container">
              <div className="user-profile-icon" onClick={toggleDropdown}>
                <img
                  className="profile-image"
                  src={user?.avatar || profilepic}
                  alt="Profile"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                  }}
                />
                <span className="profile-name">{user?.name || 'Guest'}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
              {dropdownOpen && (
                <div className="user-info-card">
                  <h2>Your Account Information</h2>
                  <div className="user-info-details">
                    <div className="user-info-avatar">
                      <img
                        src={user?.avatar || profilepic}
                        alt="User Avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                        }}
                      />
                    </div>
                    <div className="user-info-text">
                      <p><strong>Name:</strong> {user?.name || 'user'}</p>
                      <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                      <p><strong>Account Type:</strong> {user?.role || 'user'}</p>
                    </div>
                  </div>
                  <Link to="/Profile" className="view-profile-button">
                    View Full Profile
                  </Link>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome <span>{user?.name}</span> to your Dashboard</h1>
        <p>Here you can access all your courses and track your progress.</p>

        {/* Your Enrolled Courses */}
        <div className="course-tracking-section">
          <div className="section-header">
            <h2>Your Enrolled Courses</h2>
            <Link to="/Course" className="browse-courses-button">Browse Courses</Link>
          </div>
          {enrolledCourses.length > 0 ? (
            <div className="enrolled-courses-grid">
              {enrolledCourses.map(course => (
                <div key={course._id || course.id} className="course-card">
                  <div className="course-thumbnail">
                    {/* <img
                      src={course.thumbnail || process.env.PUBLIC_URL + ''}
                      alt={course.courseName || course.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = process.env.PUBLIC_URL + '/c&c2 (2).jpg';
                      }}
                    /> */}
                    <img
                      src={course.thumbnail || process.env.PUBLIC_URL + '/c&c2 (2).jpg'}
                      alt={course.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = process.env.PUBLIC_URL + '/c&c2 (2).jpg';
                      }}
                    />
                  </div>

                  <div className="course-details">
                    <h3>{course.courseName || course.title}</h3>
                    <p className="instructor">Instructor: {course.courseInstructor || course.instructor}</p>
                    {course.enrolledAt && (
                      <p className="enrolled-date">
                        Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}
                      </p>
                    )}
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${courseProgress[course._id || course.id] || 0}%` }}
                        ></div>
                      </div>

                      <span className="progress-text">
                        {courseProgress[course._id || course.id] || 0}% Complete
                      </span>
                    </div>

                    <div className="course-modules-info">
                      <span>
                        {course.completedModules || 0}/{course.totalModules || 1} modules completed
                      </span>
                    </div>

                    <Link
                      to={`/course?video=${getCourseFirstVideo(course._id || course.id)}`}
                      className="continue-course-button"
                      onClick={() => {
                        // Force full page reload
                        setTimeout(() => {
                          window.location.reload();
                        }, 0);
                      }}
                    >
                      {(course.completedModules || 0) === 0 ? 'Start Course' : 'Continue Learning'}
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-courses-message">
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/Course" className="browse-courses-button">Browse Courses</Link>
            </div>
          )}
        </div>

        {/* Recommended courses */}
        <div className="recommended-courses-section">
          <h2>Recommended For You</h2>
          <div className="recommended-courses-grid">
            {recommendedCourses.length > 0 ? (
              recommendedCourses.map(course => (
                <div key={course._id || course.id} className="course-card">
                  <div className="course-thumbnail">
                    <img
                      src={course.thumbnail || process.env.PUBLIC_URL + '/c&c2 (2).jpg'}
                      alt={course.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = process.env.PUBLIC_URL + '/c&c2 (2).jpg';
                      }}
                    />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <button
                      onClick={() => enrollInCourse(course._id || course.id)}
                      className="enroll-button"
                      disabled={enrolledCourses.some(enrolled =>
                        (enrolled._id || enrolled.id) === (course._id || course.id)
                      )}
                    >
                      {enrolledCourses.some(enrolled =>
                        (enrolled._id || enrolled.id) === (course._id || course.id)
                      ) ? 'Enrolled' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No recommended courses available.</p>
            )}
          </div>
        </div>

        {/* Learning statistics */}
        <div className="learning-stats-section">
          <h2>Your Learning Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-value">{enrolledCourses.length}</div>
              <div className="stat-label">Courses Enrolled</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">
                {enrolledCourses.reduce((total, course) => total + (course.completedModules || 0), 0)}
              </div>
              <div className="stat-label">Modules Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">
                {enrolledCourses.filter(course => (course.completedModules || 0) === (course.totalModules || 1)).length}
              </div>
              <div className="stat-label">Courses Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">
                {enrolledCourses.length === 0
                  ? "0%"
                  : Math.round(
                    enrolledCourses.reduce((sum, course) =>
                      sum + ((course.completedModules || 0) / (course.totalModules || 1)), 0
                    ) / enrolledCourses.length * 100
                  ) + "%"
                }
              </div>
              <div className="stat-label">Average Completion</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;