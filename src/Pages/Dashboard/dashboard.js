import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase';
import { signOut } from 'firebase/auth';
import ct from '../../Assets/ct.jpg';
import fa from '../../Assets/fa.jpg';
import './dashboard.css';
import profilepic from '../../Assets/profilepic.jpg';
import technicalanalysis from '../../Assets/technical analysis.jpg';
import Footer from '../../Components/Footer/footer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Static course definitions for recommendations/fallbacks
const courseMap = {
  'technical': {
    id: 'technical',
    title: 'Technical Analysis',
    instructor: 'John Smith',
    thumbnail: technicalanalysis,
    totalModules: 10,
    completedModules: 4,
  },
  'fundamental': {
    id: 'fundamental',
    title: 'Fundamental Analysis',
    instructor: 'Sarah Johnson',
    thumbnail: fa,
    totalModules: 8,
    completedModules: 2,
  },
  'commodity': {
    id: 'commodity',
    title: 'Commodity Trading',
    instructor: 'Michael Chen',
    thumbnail: ct,
    totalModules: 12,
    completedModules: 9,
  },
  'forex': {
    id: 'forex',
    title: 'Features & Options',
    instructor: 'Alex Wong',
    thumbnail: process.env.PUBLIC_URL + '/c&c2 (2).jpg',
    totalModules: 10,
    completedModules: 3,
  },
};

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

  // Fetch enrolled courses from backend after login or user update
  // (Inside useEffect which fetches enrolled courses)
useEffect(() => {
  if (!user?.uid) {
    setEnrolledCourses([]);
    return;
  }
  setLoading(true);
  fetch(`${API_BASE}/api/enrollments/users/${user.uid}/enrolled-courses`, {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      // Ensure each course has an 'id' property
      const courses = (data.courses || []).map(course => ({
        ...course,
        id: course.id || course._id, // add id if missing
      }));
      setEnrolledCourses(courses);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [user]);

  // List recommended courses: those not enrolled
  useEffect(() => {
    const enrolledIds = enrolledCourses.map(c => c.id);
    setRecommendedCourses(
      Object.values(courseMap).filter(c => !enrolledIds.includes(c.id))
    );
  }, [enrolledCourses]);

  // Backend course enrollment
  const enrollInCourse = async (courseId, courseName) => {
    console.log(`Enrolling in course: ${courseId}`);
    console.log(`Course Name: ${courseName}`);
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/enrollments/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.uid,
          courseId,
          courseName
        })
      });
      const data = await res.json();
      console.log('Enrollment response:', data);
      if (data.success) {
        alert(`Successfully enrolled in ${courseName}!`);
        // Refresh enrolled courses
        const enrolledRes = await fetch(`${API_BASE}/api/enrollments/users/${user.uid}/enrolled-courses`, {
          credentials: 'include',
        });
        const enrolledData = await enrolledRes.json();
        setEnrolledCourses(enrolledData.courses || []);
      } else {
        alert(data.message || "Enrollment failed");
      }
    } catch (e) {
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
    } catch (error) {}
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const getCourseFirstVideo = (courseId) => {
    const courseVideoMap = {
      'technical': 'tech-1',
      'fundamental': 'fund-1',
      'commodity': 'comm-1',
      'forex': 'forex-1',
    };
    return courseVideoMap[courseId] || '';
  };

  if (loading) return <div className="loading-container">Loading...</div>;

  // Calculate statistics/progress
  const courseProgress = {};
  enrolledCourses.forEach(course => {
    courseProgress[course.id] = Math.round((course.completedModules / course.totalModules) * 100);
  });

  return (
    <div className='dashboard-container'>
      <nav className='dashboard-nav'>
        <div className="logo">
          <Link to="/home">
            <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles" className="logo-image" />
          </Link>
          <h2> CANDLES & CAPITALS </h2>
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
                  {/* <li><Link to="/settings" onClick={() => setShowProfileDropdown(false)}>Account Settings</Link></li> */}
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
                <div key={course.id} className="course-card">
                  {console.log(course)}
                  <div className="course-thumbnail">
                    <img
                      src={course.thumbnail }
                      alt={course.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = process.env.PUBLIC_URL + '/c&c2 (2).jpg';
                      }}
                    />
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p className="instructor">Instructor: {course.instructor}</p>
                          {course.enrolledAt && (
                              <p className="enrolled-date">
                                  Enrolled on: {new Date(course.enrolledAt).toLocaleDateString()}
                              </p>
                          )}
                          
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${courseProgress[course.id] || 0}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {courseProgress[course.id] || 0}% Complete
                      </span>
                    </div>
                    <div className="course-modules-info">
                      <span>{course.completedModules}/{course.totalModules} modules completed</span>
                    </div>
                    <Link
                      to={`/Course?video=${getCourseFirstVideo(course.id)}`}
                      className="continue-course-button"
                    >
                      Continue Learning
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
                <div key={course.id} className="course-card">
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
                      onClick={() => enrollInCourse(course.id, course.title)}
                      className="enroll-button"
                      disabled={enrolledCourses.some(enrolled => enrolled.id === course.id)}
                    >
                      {enrolledCourses.some(enrolled => enrolled.id === course.id) ? 'Enrolled' : 'Enroll Now'}
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
                {enrolledCourses.reduce((total, course) => total + course.completedModules, 0)}
              </div>
              <div className="stat-label">Modules Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">
                {enrolledCourses.filter(course => course.completedModules === course.totalModules).length}
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
                      sum + (course.completedModules / course.totalModules), 0
                    ) / enrolledCourses.length * 100
                  ) + "%"
                }
              </div>
              <div className="stat-label">Average Completion</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;