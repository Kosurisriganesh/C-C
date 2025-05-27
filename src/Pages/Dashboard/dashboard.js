import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase';
import { signOut } from 'firebase/auth';
import ct from '../../Assets/ct.jpg';
import fa from '../../Assets/fa.jpg';
import technicalanalysis from '../../Assets/technical analysis.png';
import './dashboard.css';
import profilepic from '../../Assets/profilepic.jpg'; // Import the default profile picture

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseProgress, setCourseProgress] = useState({});

    // Fetch user data from Firebase Auth and localStorage
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            // Get additional user info from localStorage if available
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

            // Combine Firebase user data with stored data or fallback defaults
            setUser({
                name: firebaseUser.displayName 
                    || storedUserInfo.displayName 
                    || "User", // fallback to "User"
                email: firebaseUser.email || storedUserInfo.email || "user@example.com",
                role: storedUserInfo.isGoogleUser ? 'Google User' : 'Registered User',
                avatar: firebaseUser.photoURL 
                    || storedUserInfo.photoURL 
                    || profilepic, // fallback to imported profilepic asset
                uid: firebaseUser.uid
            });

            // Store for later sessions
            localStorage.setItem('userInfo', JSON.stringify({
                displayName: firebaseUser.displayName || "User",
                email: firebaseUser.email || "user@example.com",
                photoURL: firebaseUser.photoURL || profilepic,
                uid: firebaseUser.uid,
                isGoogleUser: firebaseUser.providerData[0]?.providerId === 'google.com'
            }));

            fetchUserCourses(firebaseUser.email);
        } else {
            setUser(null); // Not signed in
        }
        setLoading(false);
    });

    return () => unsubscribe();
}, [navigate]);

    // Fetch user's enrolled courses from localStorage
    const fetchUserCourses = (userEmail) => {
        try {
            // Get enrolled course IDs from localStorage based on user's email
            const savedEnrollments = localStorage.getItem(`enrolledCourses_${userEmail}`);
            let enrolledCourseIds = [];

            if (savedEnrollments) {
                enrolledCourseIds = JSON.parse(savedEnrollments);
            }

            // Map course IDs to full course objects
            const courseMap = {
                'technical': {
                    id: 'technical',
                    title: 'Technical Analysis',
                    instructor: 'John Smith',
                    enrollmentDate: new Date().toISOString().split('T')[0], // Today's date
                    thumbnail: technicalanalysis,
                    totalModules: 10,
                    completedModules: 4,
                },
                'fundamental': {
                    id: 'fundamental',
                    title: 'Fundamental Analysis',
                    instructor: 'Sarah Johnson',
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    thumbnail: fa,
                    totalModules: 8,
                    completedModules: 2,
                },
                'commodity': {
                    id: 'commodity',
                    title: 'Communidity Trading',
                    instructor: 'Michael Chen',
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    thumbnail: ct,
                    totalModules: 12,
                    completedModules: 9,
                },
                'forex': {
                    id: 'forex',
                    title: 'Feature & Options',
                    instructor: 'Alex Wong',
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    thumbnail: process.env.PUBLIC_URL + '/c&c2 (2).jpg', // Use a default image
                    totalModules: 10,
                    completedModules: 3,
                }
            };

            // Convert enrolled course IDs to full course objects
            const userCourses = enrolledCourseIds
                .filter(id => courseMap[id]) // Filter out any IDs that don't have a mapping
                .map(id => courseMap[id]);

            setEnrolledCourses(userCourses);

            // Calculate progress for each course
            const progress = {};
            userCourses.forEach(course => {
                progress[course.id] = Math.round((course.completedModules / course.totalModules) * 100);
            });

            setCourseProgress(progress);

        } catch (error) {
            console.error('Error fetching user courses:', error);
            // If there's an error, fall back to empty courses
            setEnrolledCourses([]);
            setCourseProgress({});
        }
    };

    const handleProfileClick = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userInfo');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    // Helper function to map course IDs to their first video IDs
    const getCourseFirstVideo = (courseId) => {
        // Map course IDs to their first video IDs
        const courseVideoMap = {
            'technical': 'tech-1',    // Technical Analysis first video
            'fundamental': 'fund-1',  // Fundamental Analysis first video
            'commodity': 'comm-1',    // Commodity Trading first video
            'forex': 'forex-1'        // Feature & Options first video
        };

        return courseVideoMap[courseId] || '';
    };


    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

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
                                <ul className="dropdown-menu profile-dropdown " style={{
                                    position: 'absolute',
                                    top: '60%', /* Position it at the bottom of the profile container */
                                    right: '0',
                                    left: 'auto',
                                    marginTop: '0px', /* Small margin to push it slightly down */
                                    opacity: '1',
                                    visibility: 'visible',
                                    transform: 'none',
                                    zIndex: '1001',
                                    width: '250px'
                                }}>
                                    <li className="profile-header">
                                        <strong>{user.name}</strong>
                                        <span className="profile-email">{user.email}</span>
                                        <span className="profile-role">{user.role}</span>
                                    </li>
                                    <li><Link to="/Profile" onClick={() => setShowProfileDropdown(false)}>My Profile</Link></li>
                                    <li><Link to="/settings" onClick={() => setShowProfileDropdown(false)}>Account Settings</Link></li>
                                    <li><Link to="/Course" onClick={() => setShowProfileDropdown(false)}>My Courses</Link></li>
                                    <li className="logout-option" onClick={handleLogout}>Logout</li>
                                </ul>
                            )}
                        </li>
                    )
                    
                    : (
                         <li className="user-profile-container">
                             <div className="user-profile-icon" onClick={toggleDropdown}>
                                {
                                    user && (
                                         <img
                                     src={user?.avatar}
                                     alt="Profile"
                                     className="profile-image"
                                     onError={(e) => {
                                         e.target.onerror = null;
                                         e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                                     }}
                                 />

                                    )

                                }
                                {
                                    !user &&(
                                        <img  className="profile-image" src = {profilepic} alt = "default-pic"/>
                                    )
                                }
                               
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

                    )
                    
                    }
                </ul>
            </nav>

            <div className="dashboard-content">
                <h1>Welcome <span>{user?.name}</span> to your Dashboard</h1>
                <p>Here you can access all your courses and track your progress.</p>

                {/* Course tracking section */}
                <div className="course-tracking-section">
                    <div className="section-header">
                        <h2>Your Enrolled Courses</h2>
                        <Link to="/Course" className="browse-courses-button"> More Courses</Link>
                    </div>

                    {enrolledCourses.length > 0 ? (
                        <div className="enrolled-courses-grid">
                            {enrolledCourses.map(course => (
                                <div key={course.id} className="course-card">
                                    <div className="course-thumbnail">
                                        <img
                                            src={course.thumbnail}
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
                                        <p className="enrollment-date">Enrolled: {course.enrollmentDate}</p>

                                        <div className="progress-container">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${courseProgress[course.id]}%` }}
                                                ></div>
                                            </div>
                                            <span className="progress-text">
                                                {courseProgress[course.id]}% Complete
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

                {/* Learning statistics section */}
                <div className="learning-stats-section">
                    <h2>Your Learning Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📚</div>
                            <div className="stat-value">{enrolledCourses.length}</div>
                            <div className="stat-label"> Courses Enrolled </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">⏱️</div>
                            <div className="stat-value">
                                {enrolledCourses.reduce((total, course) => total + course.completedModules, 0)}
                            </div>
                            <div className="stat-label"> Modules Completed</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-value">
                                {enrolledCourses.filter(course =>
                                    course.completedModules === course.totalModules
                                ).length}
                            </div>
                            <div className="stat-label">Courses Completed</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-value">
                                {Math.round(
                                    enrolledCourses.reduce((sum, course) =>
                                        sum + (course.completedModules / course.totalModules), 0) /
                                    (enrolledCourses.length || 1) * 100
                                )}%
                            </div>
                            <div className="stat-label">Average Completion</div>
                        </div>
                    </div>
                </div>

                {/* Recommended courses section */}
                <div className="recommended-courses-section">
                    <h2>Recommended For You</h2>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;