import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase';
import { signOut } from 'firebase/auth';
import ct from '../../Assets/ct.jpg';
import fa from '../../Assets/fa.jpg';
import technicalanalysis from '../../Assets/technical analysis.png';
import Header from '../../Components/Header/header.js';
import Footer from '../../Components/Footer/footer.js';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [courseProgress, setCourseProgress] = useState({});
    
    // Fetch user data from Firebase Auth and localStorage
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                // Get additional user info from localStorage if available
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                
                // Combine Firebase user data with stored data
                setUser({
                    name: firebaseUser.displayName || storedUserInfo.displayName || 'User',
                    email: firebaseUser.email,
                    role: storedUserInfo.isGoogleUser ? 'Google User' : 'Registered User',
                    avatar: firebaseUser.photoURL || process.env.PUBLIC_URL + '/avatar-placeholder.png',
                    uid: firebaseUser.uid
                });
                
                // Fetch enrolled courses for this user
                fetchUserCourses(firebaseUser.uid);
            } else {
                // No user is signed in, redirect to login
                navigate('/login');
            }
            setLoading(false);
        });
        
        // Cleanup subscription
        return () => unsubscribe();
    }, [navigate]);
    
    // Fetch user's enrolled courses
    const fetchUserCourses = async (userId) => {
        try {
            // This would typically be a call to your backend or Firebase
            // For now, we'll use mock data
            
            // Mock data for demonstration
            const mockEnrolledCourses = [
                {
                    id: 'course1',
                    title: 'Technical Analysis',
                    instructor: 'John Smith',
                    enrollmentDate: '2023-05-15',
                    thumbnail: technicalanalysis,
                    totalModules: 10,
                    completedModules: 4,
                },
                {
                    id: 'course2',
                    title: 'Fundamental Analysis',
                    instructor: 'Sarah Johnson',
                    enrollmentDate: '2023-06-02',
                    thumbnail:fa,
                    totalModules: 8,
                    completedModules: 2,
                },
                {
                    id: 'course3',
                    title: 'Communidity Trading ',
                    instructor: 'Michael Chen',
                    enrollmentDate: '2023-04-20',
                    thumbnail: ct,
                    totalModules: 12,
                    completedModules: 9,
                }
            ];
            
            setEnrolledCourses(mockEnrolledCourses);
            
            // Calculate progress for each course
            const progress = {};
            mockEnrolledCourses.forEach(course => {
                progress[course.id] = Math.round((course.completedModules / course.totalModules) * 100);
            });
            
            setCourseProgress(progress);
            
        } catch (error) {
            console.error('Error fetching user courses:', error);
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
    
    const continueCourse = (courseId) => {
        // Navigate to the course page with the last viewed module
        navigate(`/course/${courseId}`);
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return(
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
                    <li><Link to="/Contact"> CONTACT </Link></li>
                    
                    <li className="dropdown-container">
                        <span><Link to="/Course"> COURSES </Link></span>
                        <ul className="dropdown-menu">
                            <li><Link to="/Course"> Technical Analysis </Link></li>
                            <li><Link to="/Course"> Fundamental Analysis </Link></li>
                            <li><Link to="/Course"> Commodity Trading </Link></li>
                            <li><Link to="/Course"> Features & Option </Link></li>
                        </ul>
                    </li>
                    
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
                                <ul className="dropdown-menu profile-dropdown "style={{
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
                    ) : (
                        <li><Link to='/login'> 👤LOGIN </Link></li>
                    )}
                </ul>
            </nav>
            
            <div className="dashboard-content">
                <h1>Welcome <span>{user?.name}</span> to your Dashboard</h1>
                <p>Here you can access all your courses and track your progress.</p>
                
                {/* User information card */}
                {/* <div className="user-info-card">
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
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Account Type:</strong> {user?.role}</p>
                        </div>
                    </div>
                    <Link to="/Profile" className="view-profile-button">
                        View Full Profile
                    </Link>
                </div> */}
                
                {/* Course tracking section */}
                <div className="course-tracking-section">
                    <div className="section-header">
                        <h2>Your Enrolled Courses</h2>
                        <Link to="/Course" className="browse-courses-button">Browse More Courses</Link>
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
                                                    style={{width: `${courseProgress[course.id]}%`}}
                                                ></div>
                                            </div>
                                            <span className="progress-text">
                                                {courseProgress[course.id]}% Complete
                                            </span>
                                        </div>
                                        
                                        <div className="course-modules-info">
                                            <span>{course.completedModules}/{course.totalModules} modules completed</span>
                                        </div>
                                        
                                        <button
                                            className="continue-course-button"
                                            onClick={() => continueCourse(course.id)}
                                        >
                                            <Link to="/Course">Continue Learning</Link>
                                        </button>

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
                    {/* <div className="recommended-courses-slider">
                        {/* This would typically be populated based on user interests and behavior */}
                        {/* <div className="recommended-course">
                            <img 
                                src={process.env.PUBLIC_URL + '/course-thumbnails/advanced-trading.jpg'} 
                                alt="Advanced Trading Strategies"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = process.env.PUBLIC_URL + '/course-placeholder.jpg';
                                }}
                            />
                            <h3>Advanced Trading Strategies</h3>
                            <p>Take your trading to the next level with advanced techniques</p>
                            <Link to="/course/advanced-trading" className="view-course-button">
                                View Course
                            </Link>
                        </div> */}
                        
                        {/* <div className="recommended-course">
                            <img 
                                src={process.env.PUBLIC_URL + '/course-thumbnails/risk-management.jpg'} 
                                alt="Risk Management Essentials"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = process.env.PUBLIC_URL + '/course-placeholder.jpg';
                                }}
                            />
                            <h3>Risk Management Essentials</h3>
                            <p>Learn how to protect your capital and manage risk effectively</p>
                            <Link to="/course/risk-management" className="view-course-button">
                                View Course
                            </Link>
                        </div> */}
                        
                        {/* <div className="recommended-course">
                            <img 
                                src={process.env.PUBLIC_URL + '/course-thumbnails/market-psychology.jpg'}
                                alt="Market Psychology"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = process.env.PUBLIC_URL + '/course-placeholder.jpg';
                                }}
                            />
                            <h3>Market Psychology</h3>
                            <p>Understand the mental aspects of trading</p>
                            <Link to="/course/market-psychology" className="view-course-button">
                                View Course
                            </Link>
                        </div> */}
                    {/* </div>  */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
