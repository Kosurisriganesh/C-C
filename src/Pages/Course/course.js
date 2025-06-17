import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './course.css';
import profilepic from '../../Assets/profilepic.jpg';
import Footer from '../../Components/Footer/footer';

const API_BASE_URL = "http://localhost:5000";

// Helper to ensure YouTube URL is always embeddable
function toYouTubeEmbed(url) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  let match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  match = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
}

// Utility to check for non-embeddable links (Google Meet, Zoom, Teams, etc)
function isLiveMeetingLink(url) {
  if (!url) return false;
  return /meet\.google\.com|zoom\.us|teams\.microsoft\.com/i.test(url);
}

const Course = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoToPlay = queryParams.get('video');

  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // This state is still here but not used for rendering course details
  const [courses, setCourses] = useState([]);
  const [iframeError, setIframeError] = useState(false);
  // const [selectedCourseDetails, setSelectedCourseDetails] = useState(null); // Removed

  // Fetch courses from backend
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/admin/courses`)
      .then(res => setCourses(res.data))
      .catch(err => {
        setCourses([]);
        console.error("Failed to fetch courses:", err);
      });
  }, []);

  // Fetch enrolled courses for the user
  const fetchEnrolledCourses = async (currentUser) => {
    if (!currentUser || !currentUser.uid) {
      setEnrolledCourses([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/${currentUser.uid}/enrolled-courses`);
      setEnrolledCourses(res.data.courses.map(c => c.id || c.courseId));
    } catch (e) {
      setEnrolledCourses([]);
      console.error("Failed to fetch enrolled courses:", e);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'User'),
          email: currentUser.email,
          avatar: currentUser.photoURL || profilepic,
          role: 'Member'
        });
        fetchEnrolledCourses(currentUser);
      } else {
        setUser(null);
        setEnrolledCourses([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Set default to first course details after loading courses if no video specified
  useEffect(() => {
    if (courses.length > 0 && activeCategory === null && !videoToPlay) {
      const firstCourse = courses[0];
      if (firstCourse) {
        setActiveCategory(firstCourse._id);
        setExpandedCategory(firstCourse._id);
        // setSelectedCourseDetails(firstCourse); // Removed
        setSelectedVideo(null);
        setIsPlaying(false);
      }
    }
  }, [courses, videoToPlay]);

  // Video auto-play based on query parameter
  useEffect(() => {
    if (videoToPlay && courses.length > 0) {
      let foundCategory = null;
      let foundVideo = null;
      for (const course of courses) {
        if (course.videos && course.videos.length > 0) {
          const video = course.videos.find(v => v.id === videoToPlay);
          if (video) {
            foundCategory = course;
            foundVideo = video;
            break;
          }
        }
      }
      if (foundCategory && foundVideo) {
        setActiveCategory(foundCategory._id);
        setExpandedCategory(foundCategory._id);
        setSelectedVideo(foundVideo);
        // setSelectedCourseDetails(null); // Removed
        setIsPlaying(true);
      }
    }
  }, [videoToPlay, courses]);

  // Reset iframe error when selected video changes
  useEffect(() => {
    setIframeError(false);
  }, [selectedVideo]);

  const handleVideoSelect = (categoryId, videoId) => {
    if (!user) {
      alert('Please log in to access the videos.');
      navigate('/login');
      return;
    }
    setActiveCategory(categoryId);
    setExpandedCategory(categoryId);

    const category = courses.find(cat => cat._id === categoryId);
    if (category && category.videos && category.videos.length > 0) {
      const video = category.videos.find(vid => vid.id === videoId);
      if (video) {
        setSelectedVideo(video);
        
        setIsPlaying(true);
      }
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setExpandedCategory(categoryId);

    const category = courses.find(cat => cat._id === categoryId);
    if (category) {
      // setSelectedCourseDetails(category); // Removed
      setSelectedVideo(null);
      setIsPlaying(false);
    } else {
      // setSelectedCourseDetails(null); // Removed
      setSelectedVideo(null);
      setIsPlaying(false);
    }
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const currentCourse = courses.find(c => c._id === activeCategory);

  return (
    <div className='course-container'>
      <nav className="dashboard-nav">
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles" className="logo-image" />
          <h2>CANDLES & CAPITALS</h2>
        </div>
        <ul className="nav-links">
          <li><Link to='./home'> HOME </Link></li>
          <li className="dropdown-container">
            <span><Link to="/about">ABOUT</Link></span>
            <ul className="dropdown-menu">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/about2">About Karthik sir</Link></li>
            </ul>
          </li>
          <li className="dropdown-container">
            <span><Link to="/course">COURSES</Link></span>
            <ul className="dropdown-menu">
              {courses.map(course => (
                <li key={course._id} onClick={() => handleCategoryChange(course._id)}>{course.title}</li>
              ))}
            </ul>
          </li>
          <li><Link to='./contact'> CONTACT</Link></li>
          <li className="user-profile-container">
            {loading ? (
              <div className="user-profile-icon">
                <span className="profile-name">Loading...</span>
              </div>
            ) : (
              <div className="user-profile-icon" onClick={toggleDropdown}>
                <img
                  src={user?.avatar}
                  alt="Profile"
                  className="profile-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = profilepic;
                  }}
                />
                <span className="profile-name">{user?.name}</span>
                <i className="fas fa-chevron-down"></i>
              </div>
            )}
            {dropdownOpen && user && (
              <div className="user-info-card">
                <h2>Your Account Information</h2>
                <div className="user-info-details">
                  <div className="user-info-avatar">
                    <img
                      src={user?.avatar}
                      alt="User Avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = profilepic;
                      }}
                    />
                  </div>
                  <div className="user-info-text">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Account Type:</strong> {user?.role}</p>
                  </div>
                </div>
                <Link to="/Profile" className="view-profile-button">
                  View Full Profile
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
      <div className="course-content-wrapper">
        <div className="course-sidebar">
          <h3>Course Categories</h3>
          <ul className="course-categories">
            {courses.map(category => (
              <li key={category._id}>
                <div
                  className={`category-header ${activeCategory === category._id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category._id)}
                >
                  <span>{category.title}</span>
                  {category.videos && category.videos.length > 0 && (
                    <button
                      className="expand-toggle"
                      onClick={e => {
                        e.stopPropagation();
                        toggleCategoryExpansion(category._id);
                      }}
                    >
                      {expandedCategory === category._id ? '▼' : '▶'}
                    </button>
                  )}
                  {activeCategory === category._id && <span className="active-indicator"></span>}
                </div>
                {category.videos && category.videos.length > 0 && expandedCategory === category._id && (
                  <div>
                    <ul className="video-list">
                      {category.videos.map(video => (
                        <li
                          key={video.id}
                          className={`video-item ${selectedVideo && selectedVideo.id === video.id ? 'active' : ''}`}
                          onClick={() => handleVideoSelect(category._id, video.id)}
                        >
                          <div className="video-item-content">
                            <span className="video-title">{video.title}</span>
                            <span className="video-duration">{video.duration}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="sidebar-info-box">
            <h4>Need Help Choosing?</h4>
            <p>Not sure which course is right for you? Schedule a free consultation with our experts.</p>
            <button className="consultation-btn" onClick={() => navigate('/contact')}>Book Consultation</button>
          </div>
        </div>
        <div className='Course-cover'>
          {selectedVideo ? (
            user ? (
              <div className="video-player-container">
                <h2 className="video-title">{selectedVideo.title}</h2>
                <div className="video-player">
                  {isLiveMeetingLink(selectedVideo.videoUrl) ? (
                    <div className="live-meet-wrapper">
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="join-meet-btn"
                      >
                        Join Live Class
                      </a>
                      <p style={{ marginTop: "10px" }}>Click the button above to join the live session in a new tab.</p>
                    </div>
                  ) : (
                    !iframeError ? (
                      <iframe
                        src={`${toYouTubeEmbed(selectedVideo.videoUrl)}${isPlaying ? '?autoplay=1' : ''}`}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={() => setIframeError(true)}
                      ></iframe>
                    ) : (
                      <div className="video-error">
                        <p>Sorry, this video cannot be played (embedding may be disabled).</p>
                      </div>
                    )
                  )}
                  {!isLiveMeetingLink(selectedVideo.videoUrl) && (
                    <div className="video-controls">
                      <button className="control-button" onClick={togglePlayPause}>
                        {isPlaying ? 'Pause' : 'Play'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="video-info">
                  {currentCourse && (
                    <p className="video-instructor">
                      <strong>Instructor:</strong> {currentCourse.instructor}
                    </p>
                  )}
                  {currentCourse && (
                    <p className="video-total">
                      <strong>Total Videos in this Course:</strong> {currentCourse.videos?.length || 0}
                    </p>
                  )}
                  {selectedVideo.description && (
                    <p className="video-description">
                      <strong>Description:</strong> {selectedVideo.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="video-login-block">
                <h2>Please log in to watch this video</h2>
                <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
              </div>
            )
          ) : (
            <div className="default-course-view">
              <h3>Explore Our Courses</h3>
              <p>Choose a course from the sidebar to view in Right side</p>
              
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Course;