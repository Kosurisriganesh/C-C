import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import './course.css';

import profilepic from '../../Assets/profilepic.jpg';
import Header2 from '../../Components/Header2/headerProfile';
import Footer from '../../Components/Footer/footer';
import ReactPlayer from 'react-player';


const API_BASE_URL = "http://localhost:5000";

function toYouTubeEmbed(url) {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  let match = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  match = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

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
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [iframeError, setIframeError] = useState(false);
  const [canWatch, setCanWatch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleProfileDropdown = () => setDropdownOpen(prev => !prev);
  const toggleDropdown = (key) => setOpenDropdown(prev => (prev === key ? null : key));
  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
    document.body.classList.remove('menu-open');
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/admin/courses`)
      .then(res => setCourses(res.data))
      .catch(err => {
        setCourses([]);
        console.error("Failed to fetch courses:", err);
      });
  }, []);

  const fetchEnrolledCourses = async (currentUser) => {
    if (!currentUser || !currentUser.uid) {
      setEnrolledCourses([]);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/api/enrollments/users/${currentUser.email}/enrolled-courses`);
      console.log('res.data.courses', res.data);
      setSelectedVideo(res?.data?.data)      // setEnrolledCourses(res.data.courses.map(c => ({
      //   id: c.id || c.courseId,
      //   hasVideoAccess: c.hasVideoAccess
      // })));
      // setCanWatch()
    } catch (e) {
      setEnrolledCourses([]);
      console.error("Failed to fetch enrolled courses:", e);
    }
  };

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

  useEffect(() => {
    if (courses.length > 0 && activeCategory === null && !videoToPlay) {
      const firstCourse = courses[0];
      if (firstCourse) {
        setActiveCategory(firstCourse._id);
        setExpandedCategory(firstCourse._id);
        setSelectedVideo(null);
        setIsPlaying(false);
      }
    }
  }, [courses, videoToPlay]);

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
        setIsPlaying(true);
      }
    }
  }, [videoToPlay, courses]);

  useEffect(() => setIframeError(false), [selectedVideo]);

  //   useEffect(() => {
  //     let interval = null;
  //     async function checkAccess() {
  //       if (!user || !activeCategory) {
  //         setCanWatch(false);
  //         return;
  //       }
  //       try {
  //        console.log('Checking access for user:', user.uid);
  // //      const res = await axios.get(`${API_BASE_URL}/api/enrollments/users/${currentUser.uid}/enrolled-courses`);

  //         const res = await axios.get(`${API_BASE_URL}/api/users/${user.uid}/enrolled-courses`);
  //         console.log('Access check response:', res.data);
  //         // setCanWatch(res.data.enrollment?.hasVideoAccess === true);
  //       } catch {
  //         setCanWatch(false);
  //       }
  //     }
  //     if (user && activeCategory) {
  //       checkAccess();
  //       interval = setInterval(checkAccess, 2000);
  //     }
  //     return () => {
  //       if (interval) clearInterval(interval);
  //     };
  //   }, [user, activeCategory]);

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

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
  };

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const currentCourse = courses.find(c => c._id === activeCategory);

  const getYouTubeThumbnail = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
  };


  return (
    <div className='course-container'>
      <Header2
        isMobile={window.innerWidth <= 768}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
        closeMenu={closeMenu}
        courses={courses}
        user={user}
        loading={loading}
      />

      <div className="course-content-wrapper">
        <div className="course-sidebar-wrapper">
          {sidebarOpen ? (
            <div className="course-sidebar">
              <><Link to="/dashboard" className="back-link">← Back to Dashboard </Link>
              </>
              <div className="sidebar-heading-toggle" onClick={() => setSidebarOpen(false)}>
                <h3>Course Categories</h3>
                <span className="toggle-arrow">←</span>

              </div>
              <ul className="course-categories">
                {courses.map(category => (
                  <li key={category._id}>
                    {console.log('category', category)}
                    <div
                      className={`category-header ${activeCategory === category._id ? 'active' : ''}`}
                      onClick={() => toggleCategoryExpansion(category._id)}
                    >
                      <div className="category-title-arrow">
                        <span className="category-title">{category.title}</span>
                        {category.videos?.length > 0 && (
                          <span className="course-toggle-arrow">
                            {expandedCategory === category._id ? '▼' : '▶'}
                          </span>
                        )}
                      </div>
                      {activeCategory === category._id && <span className="active-indicator"></span>}
                    </div>

                    {/* {category.videos && expandedCategory === category._id && (
                      <ul className="video-list">
                        {category.videos.map(video => (
                          <li
                            key={video._id}
                            className={`video-item ${selectedVideo?._id === video._id ? 'active' : ''}`}
                            onClick={() => handleVideoSelect(category._id, video._id)}
                          >
                            <div className="video-item-content">
                              <span className="video-title">{video.title}</span>
                              <span className="video-duration">{video.duration}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )} */}
                  </li>
                ))}
              </ul>

              <div className="sidebar-info-box">
                <h4>Need Help Choosing?</h4>
                <p>Not sure which course is right for you? Schedule a free consultation with our experts.</p>
                <button className="consultation-btn" onClick={() => navigate('/contact')}>Book Demo</button>
              </div>
            </div>
          ) : (
            <button className="sidebar-open-arrow" onClick={() => setSidebarOpen(true)}>→</button>
          )}
        </div>

        <div className='Course-cover'>
          {/* {selectedVideo ? (
            user ? (
              canWatch ? (
                <div className="video-player-container">
                  <h2 className="video-title">{selectedVideo.title}</h2>
                  <div className="video-player">
                    {isLiveMeetingLink(selectedVideo.videoUrl) ? (
                      <div className="live-meet-wrapper">
                        <a href={selectedVideo.videoUrl} target="_blank" rel="noopener noreferrer" className="join-meet-btn">
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

                  {selectedVideo.pdfUrl && (
                    <div className="pdf-download-section">
                      <a href={selectedVideo.pdfUrl} target="_blank" rel="noopener noreferrer" className="download-pdf-btn">
                        📄 Download PDF
                      </a>
                    </div>
                  )}

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
                <div className="video-access-block">
                  <h2>Access Pending</h2>
                  <p>Your access to this course's videos is pending admin approval.</p>
                </div>
              )
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
          )} */}

          {/* {console.log('selectedVideo', selectedVideo, 'expandedCategory', expandedCategory)} */}

        {/* Show Login/Access Denied/Player */}
        
          {!user ? (
            <div className="video-login-block">
              <h2>Please log in to watch this video</h2>
              <button className="login-btn" onClick={() => navigate('/login')}>Log In</button>
            </div>
          ) : selectedVideo?.some(
              courseData => expandedCategory === courseData.courseId && courseData.videoAccess === false
            ) ? (
            <div className="video-access-block">
              <h2>Access Denied</h2>
              <p>Your access to this course's videos is pending admin approval.</p>
            </div>
          ) : (
            selectedVideo?.map((courseData, i) =>
              expandedCategory === courseData.courseId && courseData.videoAccess === true && (
                <div className="video-player-container" key={i}>
                  <h2 className="video-title">{courseData?.courseName}</h2>
                  {currentCourse && (
                    <div className="video-info">
                      <p className="video-instructor">
                        <strong>Instructor:</strong> <span>{currentCourse.instructor}</span>
                      </p>
                      <p className="video-total">
                        <strong>Total Videos in this Course:</strong> <span>{courseData.videos?.length || 0}</span>
                      </p>
                    </div>
                  )}
                  <div className="video-player">
                    {courseData.videos.map((video, index) => (
                      <div key={index}>
                        {video?.title === 'Live-class' ? (
                          <div className="live-meet-wrapper">
                            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="join-meet-btn">
                              Join Live Class
                            </a>
                            <p style={{ marginTop: "10px" }}>
                              Click the button above to join the live session in a new tab.
                            </p>
                          </div>
                        ) : (
                          !iframeError ? (
                            <div className="video-thumbnail-container">
                              <img
                                src={getYouTubeThumbnail(video.videoUrl)}
                                alt={video.title}
                                className="video-thumbnail"
                                onClick={() => {
                                  axios.post(`${API_BASE_URL}/api/track-video`, {
                                    userId: user?.uid,
                                    videoId: video._id,
                                    courseId: courseData.courseId,
                                    timestamp: new Date().toISOString(),
                                  }).catch((error) => {
                                    console.error('Tracking error:', error);
                                  });
                                  window.open(video.videoUrl, '_blank');
                                }}
                              />
                              {video.pdfUrl && (
                                <div className="pdf-download-section">
                                  <a href={video.pdfUrl} target="_blank" rel="noopener noreferrer" className="download-pdf-btn">
                                    📄 Download PDF
                                  </a>
                                </div>
                              )}
                              <p className="video-title">{video.title}</p>
                            </div>
                          ) : (
                            <div className="video-error">
                              <p>Sorry, this video cannot be played (embedding may be disabled).</p>
                            </div>
                          )
                        )}
                        {video.description && (
                          <p className="video-description">
                            <strong>Description:</strong> {video.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Course;
