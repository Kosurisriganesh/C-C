import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './course.css';

const Course = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const videoToPlay = queryParams.get('video'); // Get video ID from query params

  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch user data when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser({
          name: currentUser.displayName || 'User',
          email: currentUser.email,
          avatar: currentUser.photoURL || process.env.PUBLIC_URL + '/profilepic.jpg',
          role: 'Member'
        });
      } else {
        // User is signed out
        setUser(null);
        // navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Load enrolled courses from localStorage when user data is available
  useEffect(() => {
    if (user && user.email) {
      const savedEnrollments = localStorage.getItem(`enrolledCourses_${user.email}`);
      if (savedEnrollments) {
        setEnrolledCourses(JSON.parse(savedEnrollments));
      }
    }
  }, [user]);

  // Updated course categories with nested videos
  const courseCategories = [
    {
      id: 'all',
      name: 'All Courses',
      hasVideos: false
    },
    {
      id: 'technical',
      name: 'Technical Analysis',
      hasVideos: true,
      videos: [
        {
          id: 'tech-1',
          title: 'Introduction to Technical Analysis',
          description: 'Learn the basics of technical analysis and how to read stock charts.',
          duration: '45:30',
          videoUrl: 'https://www.youtube.com/embed/Xn7KWR9EOGQ'
        },
        {
          id: 'tech-2',
          title: 'Chart Patterns & Indicators',
          description: 'Master the most important chart patterns and technical indicators.',
          duration: '38:15',
          videoUrl: 'https://www.youtube.com/embed/QIIkdQxagdA'
        }
      ]
    },
    {
      id: 'fundamental',
      name: 'Fundamental Analysis',
      hasVideos: true,
      videos: [
        {
          id: 'fund-1',
          title: 'Understanding Financial Statements',
          description: 'Learn how to analyze balance sheets, income statements, and cash flow statements.',
          duration: '52:20',
          videoUrl: 'https://www.youtube.com/embed/bZEsFyRJE-4'
        },
        {
          id: 'fund-2',
          title: 'Valuation Methods',
          description: 'Explore different methods to value stocks and companies.',
          duration: '41:05',
          videoUrl: 'https://www.youtube.com/embed/znmQ7oMiQrM'
        }
      ]
    },
    {
      id: 'commodity',
      name: 'Commodity Trading',
      hasVideos: true,
      videos: [
        {
          id: 'comm-1',
          title: 'Basics of Commodity Markets',
          description: 'Introduction to commodity markets and how they work.',
          duration: '36:45',
          videoUrl: 'https://www.youtube.com/embed/CS9OO0S5w2k'
        },
        {
          id: 'comm-2',
          title: 'Commodity Trading Strategies',
          description: 'Learn effective strategies for trading commodities.',
          duration: '48:30',
          videoUrl: 'https://www.youtube.com/embed/7KRZ7lYxqFI'
        }
      ]
    },
    {
      id: 'forex',
      name: 'Feature & Options',
      hasVideos: true,
      videos: [
        {
          id: 'forex-1',
          title: 'Introduction to F&O',
          description: 'Learn the basics of futures and options trading.',
          duration: '55:15',
          videoUrl: 'https://www.youtube.com/embed/iOxWFLxL-A4'
        },
        {
          id: 'forex-2',
          title: 'Advanced F&O Strategies',
          description: 'Master complex options strategies for different market conditions.',
          duration: '62:40',
          videoUrl: 'https://www.youtube.com/embed/uQLSQlGJVWU'
        }
      ]
    }
  ];

  // Auto-play video based on URL parameters when component mounts
  useEffect(() => {
    if (videoToPlay) {
      // Map video IDs to their categories
      const videoToCategoryMap = {
        'tech-1': 'technical',
        'tech-2': 'technical',
        'fund-1': 'fundamental',
        'fund-2': 'fundamental',
        'comm-1': 'commodity',
        'comm-2': 'commodity',
        'forex-1': 'forex',
        'forex-2': 'forex'
      };

      const categoryId = videoToCategoryMap[videoToPlay];

      if (categoryId) {
        // Set the active category and expand it
        setActiveCategory(categoryId);
        setExpandedCategory(categoryId);

        // Find the category
        const category = courseCategories.find(cat => cat.id === categoryId);
        if (category && category.videos) {
          // Find the video
          const video = category.videos.find(v => v.id === videoToPlay);
          if (video) {
            setSelectedVideo(video);
            setIsPlaying(true);
          }
        }
      }
    }
  }, [videoToPlay, courseCategories]);

  // Handle course enrollment
  const handleEnroll = (categoryId) => {
    if (!enrolledCourses.includes(categoryId)) {
      const updatedEnrollments = [...enrolledCourses, categoryId];
      setEnrolledCourses(updatedEnrollments);

      // Save to localStorage
      if (user && user.email) {
        localStorage.setItem(`enrolledCourses_${user.email}`, JSON.stringify(updatedEnrollments));
      }

      // Show success message
      alert(`Successfully enrolled in ${courseCategories.find(cat => cat.id === categoryId).name}!`);
    } else {
      alert('You are already enrolled in this course!');
    }
  };

  // Check if user is enrolled in a course
  const isEnrolled = (categoryId) => {
    return enrolledCourses.includes(categoryId);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Select and play the first video of the category if available
    const category = courseCategories.find(cat => cat.id === categoryId);
    if (category && category.videos && category.videos.length > 0) {
      setSelectedVideo(category.videos[0]);
      setIsPlaying(true);
    } else {
      setSelectedVideo(null); // Clear selected video if no videos in category
    }
    console.log("course clicked", categoryId);
  };

  const toggleCategoryExpansion = (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleVideoSelect = (categoryId, videoId) => {
    // Find the selected category
    const category = courseCategories.find(cat => cat.id === categoryId);
    if (category && category.videos) {
      // Find the selected video
      const video = category.videos.find(vid => vid.id === videoId);
      if (video) {
        setSelectedVideo(video);
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className='course-container'>
      <nav className="dashboard-nav">
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles" className="logo-image" />
          <h2>CANDLES & CAPITALS</h2>
        </div>

        <ul className="nav-links">
          <li><Link to='./home' > HOME </Link></li>
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
              <li>Technical Analysis</li>
              <li>Fundamental Analysis</li>
              <li>Commodity Trading</li>
              <li>Features & Option</li>
            </ul>
          </li>

          <li><Link to='./contact' > CONTACT</Link></li>

          <li className="user-profile-container">
            <div className="user-profile-icon" onClick={toggleDropdown}>
              <img
                src={user?.avatar}
                alt="Profile"
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                }}
              />
              <span className="profile-name">{user?.name}</span>
              <i className="fas fa-chevron-down"></i>
            </div>

            {dropdownOpen && (
              <div className="user-info-card">
                <h2>Your Account Information</h2>
                <div className="user-info-details">
                  <div className="user-info-avatar">
                    <img
                      src={user?.avatar}
                      alt="User Avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                      }}
                    />
                  </div>
                  <div className="user-info-text">
                    <p><strong>Name:</strong> {user?.name} </p>
                    <p><strong>Email:</strong> {user?.email} </p>
                    <p><strong>Account Type:</strong> {user?.role} </p>
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
        {/* Left Side Navigation with expandable categories */}
        <div className="course-sidebar">
          <h3>Course Categories</h3>
          <ul className="course-categories">
            {courseCategories.map(category => (
              <li key={category.id}>
                <div
                  className={`category-header ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <span>{category.name}</span>
                  {category.hasVideos && (
                    <button
                      className="expand-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategoryExpansion(category.id);
                      }}
                    >
                      {expandedCategory === category.id ? '▲' : '▼'}
                    </button>
                  )}
                  {activeCategory === category.id && <span className="active-indicator"></span>}
                </div>

                {category.hasVideos && expandedCategory === category.id && (
                  <div>
                    <ul className="video-list">
                      {category.videos.map(video => (
                        <li
                          key={video.id}
                          className={`video-item ${selectedVideo && selectedVideo.id === video.id ? 'active' : ''}`}
                          onClick={() => handleVideoSelect(category.id, video.id)}
                        >
                          <div className="video-item-content">
                            <span className="video-title">{video.title}</span>
                            <span className="video-duration">{video.duration}</span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Add enrollment button */}
                    {category.id !== 'all' && (
                      <div className="enrollment-section">
                        {isEnrolled(category.id) ? (
                          <button className="enrolled-btn" disabled>
                            <i className="fas fa-check-circle"></i> Enrolled
                          </button>
                        ) : (
                          <button
                            className="enroll-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnroll(category.id);
                            }}
                          >
                            Enroll Now
                          </button>
                        )}
                      </div>
                    )}
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
            <div className="video-player-container">
              <h2 className="video-title">{selectedVideo.title}</h2>

              <div className="video-player">
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=${isPlaying ? 1 : 0}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                <div className="video-controls">
                  <button
                    className="control-button"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>
              </div>

              <div className="video-info">
                <p className="video-description">{selectedVideo.description}</p>
                <p className="video-duration"><strong>Duration:</strong> {selectedVideo.duration}</p>
              </div>
            </div>
          ) : (
            <>
              <br />
              <br />
              <h3>OUR COURSES</h3>
              <p>We Offer Following Stock Trading Courses</p>
              <div className="course-instructions">
                <p>Select a course category from the left sidebar and choose a video to start learning.</p>

              </div>
              {enrolledCourses.length > 0 && (
                <div className="enrolled-courses-section">
                  <h4>Your Enrolled Courses</h4>
                  <ul className="enrolled-courses-list">
                    {enrolledCourses.map(courseId => {
                      const course = courseCategories.find(cat => cat.id === courseId);
                      return course ? (
                        <li key={courseId} onClick={() => handleCategoryChange(courseId)}>
                          <span>{course.name}</span>
                          <i className="fas fa-arrow-right"></i>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>


      {/* Footer section */}
      {/* Advanced Footer */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-column">
            <div className="footer-logo">
              <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles & Capitals" />
              <h3>CANDLES & CAPITALS</h3>
            </div>
            <p className="footer-description">
              Empowering traders and investors with knowledge and strategies to navigate the financial markets with confidence.
            </p>
            <div className="social-icons">

              <a href="https://www.instagram.com/karthik_traderr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="https://www.youtube.com/@candlesandcapital" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/Home">Home</Link></li>
              <li><Link to="/About">About Us</Link></li>
              <li><Link to="/Courses">Courses</Link></li>
              <li><Link to="/Contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Our Courses</h4>
            <ul className="footer-links">
              <li><Link to="/courses/">Technical Analysis</Link></li>
              <li><Link to="/courses/">Fundamental Analysis</Link></li>
              <li><Link to="/courses/">Commodity Trading</Link></li>
              <li><Link to="/courses/">Features & Options</Link></li>

            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              <li>
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <span>Opp.Apollo Pharmacy,Kanithi Road, Gajuwaka,Visakhapatnam.</span>
              </li>
              <li>
                <i className="fas fa-phone contact-icon"></i>
                <span>+91 8978131328</span>
              </li>
              <li>
                <i className="fas fa-envelope contact-icon"></i>
                <span>candlesandcapital@gmail.com</span>
              </li>
            </ul>

          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>© {new Date().getFullYear()} Candles & Capitals. All rights reserved.</p>
          </div>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
          <h3>Developed by Ganesh</h3>
        </div>

      </footer>
    </div>
  );
};

export default Course;