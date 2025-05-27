import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase'; // Make sure this path is correct
import { onAuthStateChanged } from 'firebase/auth'; // Import from firebase/auth
import './dashboardadmin.css'; // Assuming this CSS file contains the styles for the dashboard and course management
import Footer from '../../Components/Footer/footer';


const AdminDashboard = () => {
    // State for the authenticated user information
    const [user, setUser] = useState({
        name: "candlesandcapitals",
        email: "candlesandcapitals@gmail.com",
        role: "Admin",
        avatar: process.env.PUBLIC_URL + '/profilepic.jpg'
    });
    // State to control the visibility of the profile dropdown
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    // State to manage the currently active menu item in the sidebar
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    // State to control the collapsed/expanded state of the sidebar
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // State for users data (for user management section)
    const [users, setUsers] = useState([]);
    // State for courses data (for course management section)
    const [courses, setCourses] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    // State for course management modals
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null); // Stores course being edited or null for new course

    // State for video management modals
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null); // Stores video being edited or null for new video
    const [parentCourseIdForVideo, setParentCourseIdForVideo] = useState(null); // Stores ID of course to which video belongs

    // State for confirmation modal
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null); // Function to execute on confirmation
    const [confirmationMessage, setConfirmationMessage] = useState('');

    // Effect hook to handle Firebase authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                setUser({
                    name:
                        firebaseUser.displayName ||
                        storedUserInfo.displayName ||
                        "candlesandcapitals",
                    email:
                        firebaseUser.email ||
                        storedUserInfo.email ||
                        "candlesandcapitals@gmail.com",
                    role:
                        storedUserInfo.isGoogleUser
                            ? "Google User"
                            : "Admin",
                    avatar:
                        firebaseUser.photoURL ||
                        storedUserInfo.photoURL ||
                        process.env.PUBLIC_URL + '/profilepic.jpg',
                    uid: firebaseUser.uid
                });
                localStorage.setItem('userInfo', JSON.stringify({
                    displayName: firebaseUser.displayName || "candlesandcapitals",
                    email: firebaseUser.email || "candlesandcapitals@gmail.com",
                    photoURL: firebaseUser.photoURL || process.env.PUBLIC_URL + '/profilepic.jpg',
                    uid: firebaseUser.uid,
                    isGoogleUser: firebaseUser.providerData[0]?.providerId === 'google.com'
                }));
            } else {
                // If user logs out, show default admin (optional: or set to null)
                setUser({
                    name: "candlesandcapitals",
                    email: "candlesandcapitals@gmail.com",
                    role: "Admin",
                    avatar: process.env.PUBLIC_URL + '/profilepic.jpg'
                });
            }
        });
        return () => unsubscribe();
    }, []);

    // Effect hook to simulate fetching data based on the active menu item
    useEffect(() => {
        if (activeMenuItem === 'users') {
            setUsers([
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'Active' },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Instructor', status: 'Inactive' },
                { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Student', status: 'Active' },
            ]);
        } else if (activeMenuItem === 'courses') {
            // Simulate fetching courses data
            setCourses([
                {
                    id: 'course-1',
                    title: 'Technical Analysis Fundamentals',
                    description: 'Learn chart patterns, indicators, and trading strategies.',
                    videos: [
                        { id: 'video-101', title: 'Introduction to Candlestick Patterns', url: 'https://example.com/video101' },
                        { id: 'video-102', title: 'Understanding Support and Resistance', url: 'https://example.com/video102' },
                        { id: 'video-103', title: 'Moving Averages and Their Applications', url: 'https://example.com/video103' },
                    ],
                },
                {
                    id: 'course-2',
                    title: 'Introduction to Fundamental Analysis',
                    description: 'Analyze company financials and economic data.',
                    videos: [
                        { id: 'video-201', title: 'Basics of Financial Statements', url: 'https://example.com/video201' },
                        { id: 'video-202', title: 'Key Financial Ratios', url: 'https://example.com/video202' },
                    ],
                },
                {
                    id: 'course-3',
                    title: 'Commodity Trading Strategies',
                    description: 'Explore the world of commodity markets.',
                    videos: [
                        { id: 'video-301', title: 'Understanding Commodity Futures', url: 'https://example.com/video301' },
                        { id: 'video-302', title: 'Risk Management in Commodities', url: 'https://example.com/video302' },
                    ],
                },
            ]);
        }
    }, [activeMenuItem]);


    

    // Handler for profile picture click to toggle dropdown
    const handleProfileClick = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    // Handler for user logout
    const handleLogout = () => {
        auth.signOut().then(() => {
            localStorage.removeItem('userInfo');
            setUser(null);
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };

    // Handler to toggle sidebar collapse state
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    // --- Course Management Functions ---

    // Opens the modal for adding a new course
    const handleAddCourse = () => {
        setCurrentCourse(null); // Clear any previous course data
        setIsCourseModalOpen(true);
    };

    // Opens the modal for editing an existing course
    const handleEditCourse = (course) => {
        setCurrentCourse(course);
        setIsCourseModalOpen(true);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Handles saving a new course or updating an existing one
    const saveCourse = (courseData) => {
        if (currentCourse) {
            // Update existing course
            setCourses(prevCourses =>
                prevCourses.map(c => (c.id === courseData.id ? { ...c, ...courseData } : c))
            );
        } else {
            // Add new course
            const newCourse = {
                id: crypto.randomUUID(), // Generate a unique ID for the new course
                videos: [], // New courses start with no videos
                ...courseData
            };
            setCourses(prevCourses => [...prevCourses, newCourse]);
        }
        setIsCourseModalOpen(false); // Close modal after saving
    };

    // Prompts for confirmation before deleting a course
    const handleDeleteCourse = (courseId) => {
        setConfirmationMessage(`Are you sure you want to delete this course? This action cannot be undone.`);
        setConfirmationAction(() => () => {
            setCourses(prevCourses => prevCourses.filter(c => c.id !== courseId));
            setShowConfirmationModal(false);
        });
        setShowConfirmationModal(true);
    };

    // --- Video Management Functions ---

    // Opens the modal for adding a new video to a specific course
    const handleAddVideo = (courseId) => {
        setParentCourseIdForVideo(courseId);
        setCurrentVideo(null); // Clear any previous video data
        setIsVideoModalOpen(true);
    };

    // Opens the modal for editing an existing video
    const handleEditVideo = (courseId, video) => {
        setParentCourseIdForVideo(courseId);
        setCurrentVideo(video);
        setIsVideoModalOpen(true);
    };

    // Handles saving a new video or updating an existing one
    const saveVideo = (videoData) => {
        setCourses(prevCourses =>
            prevCourses.map(course => {
                if (course.id === parentCourseIdForVideo) {
                    if (currentVideo) {
                        // Update existing video
                        return {
                            ...course,
                            videos: course.videos.map(v => (v.id === videoData.id ? { ...v, ...videoData } : v))
                        };
                    } else {
                        // Add new video
                        const newVideo = {
                            id: crypto.randomUUID(), // Generate a unique ID for the new video
                            ...videoData
                        };
                        return {
                            ...course,
                            videos: [...course.videos, newVideo]
                        };
                    }
                }
                return course;
            })
        );
        setIsVideoModalOpen(false); // Close modal after saving
        setParentCourseIdForVideo(null); // Clear parent course ID
    };

    // Prompts for confirmation before deleting a video
    const handleDeleteVideo = (courseId, videoId) => {
        setConfirmationMessage(`Are you sure you want to delete this video?`);
        setConfirmationAction(() => () => {
            setCourses(prevCourses =>
                prevCourses.map(course => {
                    if (course.id === courseId) {
                        return {
                            ...course,
                            videos: course.videos.filter(v => v.id !== videoId)
                        };
                    }
                    return course;
                })
            );
            setShowConfirmationModal(false);
        });
        setShowConfirmationModal(true);
    };

    // --- Modal Components ---

    // Course Modal for Add/Edit
    const CourseModal = ({ isOpen, onClose, course, onSave }) => {
        const [title, setTitle] = useState(course ? course.title : '');
        const [description, setDescription] = useState(course ? course.description : '');

        // Update local state when 'course' prop changes (for edit mode)
        useEffect(() => {
            if (course) {
                setTitle(course.title);
                setDescription(course.description);
            } else {
                setTitle('');
                setDescription('');
            }
        }, [course]);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!title.trim()) {
                console.error("Course title cannot be empty.");
                return;
            }
            onSave({
                id: course ? course.id : null, // Pass existing ID for update, null for new
                title,
                description
            });
        };

        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>{course ? 'Edit Course' : 'Add New Course'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="courseTitle">Title:</label>
                            <input
                                type="text"
                                id="courseTitle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="courseDescription">Description:</label>
                            <textarea
                                id="courseDescription"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Video Modal for Add/Edit
    const VideoModal = ({ isOpen, onClose, video, onSave }) => {
        const [title, setTitle] = useState(video ? video.title : '');
        const [url, setUrl] = useState(video ? video.url : '');

        // Update local state when 'video' prop changes (for edit mode)
        useEffect(() => {
            if (video) {
                setTitle(video.title);
                setUrl(video.url);
            } else {
                setTitle('');
                setUrl('');
            }
        }, [video]);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!title.trim() || !url.trim()) {
                console.error("Video title and URL cannot be empty.");
                return;
            }
            onSave({
                id: video ? video.id : null, // Pass existing ID for update, null for new
                title,
                url
            });
        };

        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>{video ? 'Edit Video' : 'Add New Video'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="videoTitle">Title:</label>
                            <input
                                type="text"
                                id="videoTitle"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="videoUrl">URL:</label>
                            <input
                                type="url" // Use type="url" for better validation
                                id="videoUrl"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Confirmation Modal
    const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content confirmation-modal">
                    <p>{message}</p>
                    <div className="modal-actions">
                        <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
                        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    };




    // Function to render different content based on active menu item
    const renderContent = () => {
        switch (activeMenuItem) {
            case 'dashboard':
                return (
                    <div className="dashboard-overview">
                        <p>Welcome to your Admin Dashboard. Use the sidebar to navigate.</p>
                    </div>
                );
            case 'users':
                return (
                    <div className="user-management">
                        <h2>User Management</h2>
                        <div className="user-controls">
                            <button className="add-user-btn">Add New User</button>
                            <input type="text" placeholder="Search users..." className="user-search" />
                            <select className="user-filter">
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="instructor">Instructors</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <span className={`status-badge ${user.status.toLowerCase()}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button className="edit-btn">Edit</button>
                                                <button className="delete-btn">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination">
                            <button>&laquo; Previous</button>
                            <span>Page 1 of 5</span>
                            <button>Next &raquo;</button>
                        </div>
                    </div>
                );
            case 'courses':
                return (
                    <div className="course-management">
                        <h2>Course Management</h2>
                        <div className="course-controls">
                            <button className="add-course-btn" onClick={handleAddCourse}>Add New Course</button>
                            <input type="text" placeholder="Search courses..." className="course-search" />
                        </div>
                        <div className="courses-list">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <div key={course.id} className="course-item">
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                        <h4>Videos:</h4>
                                        {course.videos && course.videos.length > 0 ? (
                                            <ul className="videos-list">
                                                {course.videos.map(video => (
                                                    <li key={video.id} className="video-item">
                                                        <span>{video.title}</span>
                                                        <div className="video-actions">
                                                            <button className="edit-video-btn" onClick={() => handleEditVideo(course.id, video)}>Edit Video</button>
                                                            <button className="delete-video-btn" onClick={() => handleDeleteVideo(course.id, video.id)}>Delete Video</button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="no-videos-message">No videos added yet. Click "Add Video" below.</p>
                                        )}
                                        <div className="course-actions">
                                            <button className="add-video-to-course-btn" onClick={() => handleAddVideo(course.id)}>Add Video</button> {/* New button */}
                                            <button className="edit-course-btn" onClick={() => handleEditCourse(course)}>Edit Course</button>
                                            <button className="delete-course-btn" onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-courses-message"></p>
                            )}
                        </div>
                    </div>
                );
            case 'orders':
                return <h2>Orders Content</h2>;
            case 'analytics':
                return <h2>Analytics Content</h2>;
            case 'messages':
                return <h2>Messages Content</h2>;
            case 'settings':
                return <h2>Settings Content</h2>;
            default:
                return <h2>Dashboard Overview</h2>;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Top Navigation Bar - Keeping this unchanged */}
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
                                <ul className="dropdown-menu profile-dropdown" style={{
                                    position: 'absolute',
                                    top: '60%',
                                    right: '0',
                                    left: 'auto',
                                    marginTop: '0px',
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
                    )}
                </ul>
            </nav>

            {/* Main Dashboard Layout with Sidebar */}
            <div className="admin-dashboard-layout">
                {/* Left Sidebar */}
                <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-toggle" onClick={toggleSidebar}>
                        {sidebarCollapsed ? '→' : '←'}
                    </div>

                    <div className="sidebar-header">
                        <h3>Admin Panel</h3>
                    </div>

                    <div className="sidebar-menu">
                        <ul>
                            <li className={activeMenuItem === 'dashboard' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('dashboard')}>
                                <a href="#dashboard">
                                    <i className="sidebar-icon">📊</i>
                                    <span className="sidebar-text">Dashboard</span>
                                </a>
                            </li>

                            <li className={activeMenuItem === 'users' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('users')}>
                                <a href="#users">
                                    <i className="sidebar-icon">👥</i>
                                    <span className="sidebar-text">User Management</span>
                                </a>
                            </li>

                            <li className={activeMenuItem === 'courses' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('courses')}>
                                <a href="#courses">
                                    <i className="sidebar-icon">📚</i>
                                    <span className="sidebar-text">Course Management</span>
                                </a>
                            </li>

                            <li className={activeMenuItem === 'orders' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('orders')}>
                                <a href="#orders">
                                    <i className="sidebar-icon">🛒</i>
                                    <span className="sidebar-text">Orders</span>
                                </a>
                            </li>

                            <li className="sidebar-divider"></li>

                            <li className={activeMenuItem === 'analytics' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('analytics')}>
                                <a href="#analytics">
                                    <i className="sidebar-icon">📈</i>
                                    <span className="sidebar-text">Analytics</span>
                                </a>
                            </li>

                            <li className={activeMenuItem === 'messages' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('messages')}>
                                <a href="#messages">
                                    <i className="sidebar-icon">💬</i>
                                    <span className="sidebar-text">Messages</span>
                                </a>
                            </li>

                            <li className={activeMenuItem === 'settings' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('settings')}>
                                <a href="#settings">
                                    <i className="sidebar-icon">⚙️</i>
                                    <span className="sidebar-text">Settings</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`admin-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                    <div className="admin-content-header">
                        <h1>Welcome {user?.name}</h1>
                        <p>Manage your platform, users, and courses from this central control panel.</p>
                    </div>

                    {/* Dynamic content based on selected menu item */}
                    <div className="admin-content-body">
                        {renderContent()}
                    </div>
                    {/* Course Add/Edit Modal */}
                    <CourseModal
                        isOpen={isCourseModalOpen}
                        onClose={() => setIsCourseModalOpen(false)}
                        course={currentCourse}
                        onSave={saveCourse}
                    />

                    {/* Video Add/Edit Modal */}
                    <VideoModal
                        isOpen={isVideoModalOpen}
                        onClose={() => setIsVideoModalOpen(false)}
                        video={currentVideo}
                        onSave={saveVideo}
                    />

                    {/* Confirmation Modal */}
                    <ConfirmationModal
                        isOpen={showConfirmationModal}
                        message={confirmationMessage}
                        onConfirm={() => {
                            if (confirmationAction) {
                                confirmationAction();
                            }
                        }}
                        onCancel={() => setShowConfirmationModal(false)}
                    />
                </div>
            </div>

            {/* Course Add/Edit Modal */}
            {/* <CourseModal
                    isOpen={isCourseModalOpen}
                    onClose={() => setIsCourseModalOpen(false)}
                    course={currentCourse}
                    onSave={saveCourse}
                /> */}

            {/* Video Add/Edit Modal */}
            {/* <VideoModal
                    isOpen={isVideoModalOpen}
                    onClose={() => setIsVideoModalOpen(false)}
                    video={currentVideo}
                    onSave={saveVideo}
                /> */}

            {/* Confirmation Modal */}
            {/* <ConfirmationModal
                    isOpen={showConfirmationModal}
                    message={confirmationMessage}
                    onConfirm={() => {
                        if (confirmationAction) {
                            confirmationAction();
                        }
                    }}
                    onCancel={() => setShowConfirmationModal(false)}
                /> */}
            <Footer />
        </div>

    );

};

export default AdminDashboard;
