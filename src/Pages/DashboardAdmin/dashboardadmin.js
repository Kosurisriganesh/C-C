import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './dashboardadmin.css';
import Footer from '../../Components/Footer/footer';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Logo from '../../Assets/Logo2.png';

const API_BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        avatar: process.env.PUBLIC_URL + '/profilepic.jpg'
    });
    const id = useParams();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [messages, setMessages] = useState([]); // New state for contact submissions
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [parentCourseIdForVideo, setParentCourseIdForVideo] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // ------------------ AUTH STATE LISTENER ------------------
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                setUser({
                    name: firebaseUser.displayName || storedUserInfo.displayName || "candlesandcapitals",
                    email: firebaseUser.email || storedUserInfo.email || "candlesandcapitals@gmail.com",
                    role: storedUserInfo.isGoogleUser ? "Google User" : "Admin",
                    avatar: firebaseUser.photoURL || storedUserInfo.photoURL || process.env.PUBLIC_URL + '/profilepic.jpg',
                    uid: firebaseUser.uid,
                    _id: storedUserInfo._id
                });
                localStorage.setItem('userInfo', JSON.stringify({
                    displayName: firebaseUser.displayName || "candlesandcapitals",
                    email: firebaseUser.email || "candlesandcapitals@gmail.com",
                    photoURL: firebaseUser.photoURL || process.env.PUBLIC_URL + '/profilepic.jpg',
                    uid: firebaseUser.uid,
                    isGoogleUser: firebaseUser.providerData[0]?.providerId === 'google.com',
                    _id: storedUserInfo._id
                }));
            } else {
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

    // ------------------ FETCH USERS ------------------
    const fetchUsers = useCallback(() => {
        if (user?.role !== 'Admin') {
            setUsers([]);
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setUsers([]);
            return;
        }
        fetch(`${API_BASE_URL}/api/admin/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            }
        })
            .then(res => {
                if (!res.status === 401 || res.status === 403) {
                    throw new Error('Unauthorized');
                }
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(err => {
                setUsers([]);
                console.error('Failed to fetch users:', err);
            });
    }, [user]);

    // ------------------ FETCH COURSES ------------------
    const fetchCourses = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCourses([]);
            return;
        }
        fetch(`${API_BASE_URL}/api/admin/courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch courses');
                }
                return res.json();
            })
            .then(data => setCourses(data))
            .catch(err => {
                setCourses([]);
                console.error('Failed to fetch courses:', err);
            });
    }, []);

    // ------------------ FETCH MESSAGES ------------------
    const fetchMessages = useCallback(() => {

        if (user?.role !== 'Admin') {
            setMessages([]);
            return;
        }
        const token = localStorage.getItem('token');

        if (!token) {
            setMessages([]);
            return;
        }
        fetch(`${API_BASE_URL}/api/contact/submissions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            }
        })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        throw new Error('Unauthorized');
                    }
                    throw new Error('Failed to fetch messages');
                }
                return res.json();
            })
            .then(data => setMessages(data))
            .catch(err => {
                setMessages([]);
                console.error('Failed to fetch messages:', err);
            });
    }, [user]);

    // ------------------ FETCH DATA ON MENU CHANGE ------------------
    useEffect(() => {
        if (activeMenuItem === 'users') {
            fetchUsers();
        } else if (activeMenuItem === 'courses') {
            fetchCourses();
        } else if (activeMenuItem === 'messages') {
            fetchMessages();
        }
    }, [activeMenuItem, fetchUsers, fetchCourses, fetchMessages]);

    // Polling: refresh users and messages every 5 seconds
    useEffect(() => {
        if (activeMenuItem === 'users') {
            const interval = setInterval(fetchUsers, 5000);
            return () => clearInterval(interval);
        }
    }, [activeMenuItem, fetchUsers]);

    const handleProfileClick = () => setShowProfileDropdown(!showProfileDropdown);
    const handleLogout = async () => {
        try {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const userId = storedUserInfo._id;
            const token = localStorage.getItem('token');
            
            console.log('=== FRONTEND LOGOUT ===');
            console.log('StoredUserInfo:', storedUserInfo);
            console.log('Extracted userId:', userId);
            console.log('Token exists:', !!token);
            
            // Also try to get userId from JWT token as backup
            let tokenUserId = null;
            if (token) {
                try {
                    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                    tokenUserId = tokenPayload.user.id;
                    console.log('UserId from token:', tokenUserId);
                } catch (e) {
                    console.log('Could not extract userId from token');
                }
            }
            
            const finalUserId = userId || tokenUserId;
            console.log('Final userId to send:', finalUserId);
            
            if (finalUserId && token) {
                console.log('Sending logout request...');
                const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ userId: finalUserId })
                });
                
                const result = await response.json();
                console.log('Logout response:', response.status, result);
                
                if (response.ok) {
                    console.log('✅ Logout successful!');
                } else {
                    console.error('❌ Logout failed:', result);
                }
            } else {
                console.log('❌ Missing userId or token');
            }
        } catch (err) {
            console.error('Logout error:', err);
        }
        
        // Continue with Firebase signout
        auth.signOut().then(() => {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    };

    useEffect(() => {
        const handleBeforeUnload = () => {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const userId = storedUserInfo._id;
            const token = localStorage.getItem('token');
            
            if (userId && token) {
                // Use sendBeacon for reliable logout on page unload
                const blob = new Blob([JSON.stringify({ userId })], { type: 'application/json' });
                navigator.sendBeacon(`${API_BASE_URL}/api/auth/logout`, blob);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);



    // ------------------ COURSE MANAGEMENT ------------------
    const handleAddCourse = () => {
        setCurrentCourse(null);
        setIsCourseModalOpen(true);
    };

    const handleEditCourse = (course) => {
        console.log("Editing course:");
        setCurrentCourse(course);
        setIsCourseModalOpen(true);
    };

    const saveCourse = (courseData) => {
        const token = localStorage.getItem('token');
        const payload = {
            title: courseData.title,
            description: courseData.description,
            instructor: courseData.instructor,
            videos: Array.isArray(courseData.videos) ? courseData.videos : []
        };
        console.log("Saving course with payload:", payload);

        if (currentCourse) {
            fetch(`${API_BASE_URL}/api/admin/courses/${currentCourse._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw new Error(err.error || "Failed to update course"); });
                    return res.json();
                })
                .then(updatedCourse => {
                    alert("Course updated successfully!");
                    setCourses(prevCourses =>
                        prevCourses.map(c => (c._id === updatedCourse._id ? updatedCourse : c))

                    );
                    setIsCourseModalOpen(false);
                })
                .catch(err => {
                    alert(`Failed to update course: ${err.message}`);
                    console.error(err);
                });
        } else {
            fetch(`${API_BASE_URL}/api/admin/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw new Error(err.error || "Failed to add course"); });
                    return res.json();
                })
                .then(newCourse => {
                    setCourses(prevCourses => [...prevCourses, newCourse]);
                    setIsCourseModalOpen(false);
                })
                .catch(err => {
                    alert(`Failed to add course: ${err.message}`);
                    console.error(err);
                });
        }
    };

    const handleDeleteCourse = (courseId) => {
        setConfirmationMessage(`Are you sure you want to delete this course? This action cannot be undone.`);
        setConfirmationAction(() => () => {
            const token = localStorage.getItem('token');
            fetch(`${API_BASE_URL}/api/admin/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to delete course");
                    setCourses(prevCourses => prevCourses.filter(c => c._id !== courseId));
                    alert("Course deleted successfully!");
                    setShowConfirmationModal(false);
                })
                .catch(err => {
                    alert("Failed to delete course");
                    setShowConfirmationModal(false);
                    console.error(err);
                });
        });
        setShowConfirmationModal(true);
    };

    const handleAddVideo = (courseId) => {
        setParentCourseIdForVideo(courseId);
        setCurrentVideo(null);
        setIsVideoModalOpen(true);
    };
    const handleEditVideo = (courseId, video) => {
        setParentCourseIdForVideo(courseId);
        setCurrentVideo(video);
        setIsVideoModalOpen(true);
    };
    const saveVideo = (videoData) => {
        setCourses(prevCourses =>
            prevCourses.map(course => {
                if (course._id === parentCourseIdForVideo) {
                    if (currentVideo) {
                        return {
                            ...course,
                            videos: course.videos.map(v => (v.id === videoData.id ? { ...v, ...videoData } : v))
                        };
                    } else {
                        const newVideo = {
                            id: crypto.randomUUID(),
                            ...videoData
                        };
                        return {
                            ...course,
                            videos: [...(course.videos || []), newVideo]
                        };
                    }
                }
                return course;
            })
        );
        setIsVideoModalOpen(false);
        setParentCourseIdForVideo(null);
    };
    const handleDeleteVideo = (courseId, videoId) => {
        setConfirmationMessage(`Are you sure you want to delete this video?`);
        setConfirmationAction(() => () => {
            setCourses(prevCourses =>
                prevCourses.map(course => {
                    if (course._id === courseId) {
                        return {
                            ...course,
                            videos: (course.videos || []).filter(v => v.id !== videoId)
                        };
                    }
                    return course;
                })
            );
            setShowConfirmationModal(false);
        });
        setShowConfirmationModal(true);
    };

    // ------------------ USER MANAGEMENT ------------------
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                }
            });
            if (!response.ok) throw new Error("Failed to delete user");
            setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
        } catch (err) {
            alert("Failed to delete user");
            console.error(err);
        }
    };

    // ------------------ MESSAGE MANAGEMENT ------------------
    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/contact/submissions/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                }
            });
            if (!response.ok) throw new Error("Failed to delete message");
            setMessages(prevMessages => prevMessages.filter(m => m._id !== messageId));
            alert("Message deleted successfully!");
        } catch (err) {
            alert("Failed to delete message");
            console.error(err);
        }
    };

    // ------------------ MODALS ------------------
    const CourseModal = ({ isOpen, onClose, course, onSave }) => {
        const [title, setTitle] = useState(course ? course.title : '');
        const [description, setDescription] = useState(course ? course.description : '');
        const [instructor, setInstructor] = useState(course ? course.instructor : '');
        const [videos, setVideos] = useState(course && course.videos ? course.videos : []);

        useEffect(() => {
            console.log("CourseModal received course:", course);
            if (course) {
                setTitle(course.title || '');
                setDescription(course.description || '');
                setInstructor(course.instructor || '');
                setVideos(course.videos || []);
            } else {
                setTitle('');
                setDescription('');
                setInstructor('');
                setVideos([]);
            }
        }, [course]);

        const handleAddVideoField = () => {
            setVideos([...videos, { id: crypto.randomUUID(), title: '', videoUrl: '' }]);
        };

        const handleRemoveVideoField = (idx) => {
            setVideos(videos.filter((_, i) => i !== idx));
        };

        const handleVideoChange = (idx, field, value) => {
            setVideos(videos.map((video, i) => (
                i === idx ? { ...video, [field]: value } : video
            )));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!title.trim() || !instructor.trim()) {
                alert("Course title and instructor cannot be empty.");
                return;
            }
            const filteredVideos = videos
                .filter(v => v.title.trim() && v.videoUrl.trim())
                .map(v => ({ ...v, id: v.id || crypto.randomUUID() }));
            onSave({
                ...course,
                title,
                description,
                instructor,
                videos: filteredVideos
            });
        };
        if (!isOpen) return null;
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>{course ? 'Edit Course' : 'Add New Course'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="modal-left">
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
                                    <label htmlFor="courseInstructor">Instructor:</label>
                                    <input
                                        type="text"
                                        id="courseInstructor"
                                        value={instructor}
                                        onChange={(e) => setInstructor(e.target.value)}
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
                                
                            </div>

                            <div className="modal-right">
                                <div className="form-group">
                                    <label>Videos:</label>
                                    {videos.map((video, idx) => (
                                        <div key={video.id || idx} className="video-box">
                                            <input
                                                type="text"
                                                placeholder="Video Title"
                                                value={video.title}
                                                onChange={e => handleVideoChange(idx, 'title', e.target.value)}
                                            />
                                            <input
                                                type="url"
                                                placeholder="Video URL"
                                                value={video.videoUrl}
                                                onChange={e => handleVideoChange(idx, 'videoUrl', e.target.value)}
                                            />
                                            <button type="button" onClick={() => handleRemoveVideoField(idx)}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddVideoField} className="add-video-to-course-btn">
                                        + Add Video
                                    </button>
                                </div>
                            </div>
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

    const VideoModal = ({ isOpen, onClose, video, onSave }) => {
        const [title, setTitle] = useState(video ? video.title : '');
        const [videoUrl, setVideoUrl] = useState(video ? video.videoUrl : '');

        useEffect(() => {
            if (video) {
                setTitle(video.title);
                setVideoUrl(video.videoUrl);
            } else {
                setTitle('');
                setVideoUrl('');
            }
        }, [video]);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!title.trim() || !videoUrl.trim()) {
                alert("Video title and URL cannot be empty.");
                return;
            }
            onSave({
                id: video ? video.id : null,
                title,
                videoUrl
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
                            <label htmlFor="videoUrl">Video URL:</label>
                            <input
                                type="url"
                                id="videoUrl"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
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

    const renderContent = () => {
        const filteredUsers = roleFilter === 'all'
            ? users
            : users.filter(u => u.role && u.role.toLowerCase() === roleFilter);

        switch (activeMenuItem) {
            case 'dashboard':
                return (
                    <div className="dashboard-overview">
                        <p>Welcome to your Admin Dashboard. Use the sidebar to navigate.</p>
                    </div>
                );
            case 'users':
                if (user?.role !== 'Admin') {
                    return (
                        <div className="not-authorized">
                            <h2>Not Authorized</h2>
                            <p>You do not have permission to view this section.</p>
                        </div>
                    );
                }
                return (
                    <div className="user-management">
                        <h2>User Management</h2>
                        <div className="user-controls">
                            <span style={{ marginLeft: "20px", fontWeight: "bold", color: 'red' }}>
                                Total: {filteredUsers.length}
                            </span>
                        </div>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Date Joined</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? filteredUsers.map(u => (
                                        <tr key={u._id}>
                                            <td>{u._id}</td>
                                            <td>{u.fullName || u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phoneNumber || '-'}</td>
                                            <td>{u.date ? new Date(u.date).toLocaleDateString() : '-'}</td>
                                            <td>
                                                <span style={{
                                                    color: u.status ? "red" : "green",
                                                    fontWeight: "bold"
                                                }}>
                                                    {u.status ? "Inactive" : "Active"}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: "center" }}>No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination">
                            <button>« Previous</button>
                            <span>Page 1</span>
                            <button>Next »</button>
                        </div>
                    </div>
                );
            case 'courses':
                return (
                    <div className="course-management">
                        <h2>Course Management</h2>
                        <div className="course-controls">
                            <button className="add-course-btn" onClick={handleAddCourse}>Add New Course</button>
                        </div>
                        <div className="courses-list">
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <div key={course._id} className="course-item">
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                        <p><strong>Instructor:</strong> {course.instructor}</p>
                                        <h4>Videos:</h4>
                                        {course.videos && course.videos.length > 0 ? (
                                            <ul className="videos-list">
                                                {course.videos.map(video => (
                                                    <li key={video.id} className="video-item">
                                                        <span>
                                                            {video.title}
                                                            <a href={video.videoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{ color: 'blue', textDecoration: 'underline' }}>
                                                                View Video
                                                            </a>
                                                        </span>
                                                        <div className="video-actions">
                                                            <button className="edit-video-btn" onClick={() => handleEditVideo(course._id, video)}><EditIcon /></button>
                                                            <button className="delete-video-btn" onClick={() => handleDeleteVideo(course._id, video.id)}><DeleteIcon /></button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="no-videos-message">No videos added yet. Click "Add Video" below.</p>
                                        )}
                                        <div className="course-actions">
                                            <button className="add-video-to-course-btn" onClick={() => handleAddVideo(course._id)}>Add Video</button>
                                            <button className="edit-course-btn" onClick={() => handleEditCourse(course)}><EditIcon />Course</button>
                                            <button className="delete-course-btn" onClick={() => handleDeleteCourse(course._id)}><DeleteIcon />Course</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-courses-message">No courses found.</p>
                            )}
                        </div>
                    </div>
                );
            case 'messages':
                if (user?.role !== 'Admin') {
                    return (
                        <div className="not-authorized">
                            <h2>Not Authorized</h2>
                            <p>You do not have permission to view this section.</p>
                        </div>
                    );
                }
                return (
                    <div className="message-management">
                        <h2>Contact Form Submissions</h2>

                        <div className="message-controls" style={{ marginBottom: "10px" }}>
                            <span style={{ marginLeft: "20px", fontWeight: "bold", color: 'red' }}>
                                Total: {messages.length}
                            </span>
                        </div>

                        <div className="messages-table-container">
                            <Table sx={{ minWidth: 650 }} aria-label="messages table">
                                <TableHead sx={{ backgroundColor: '#1976d2' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Occupation</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Contact</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Message</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Submitted At</TableCell>
                                        <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {messages.length > 0 ? (
                                        messages.map(m => (
                                            <TableRow key={m._id}>
                                                <TableCell>{m.name}</TableCell>
                                                <TableCell>{m.email}</TableCell>
                                                <TableCell>{m.occupation}</TableCell>
                                                <TableCell>{m.contact}</TableCell>
                                                <TableCell>{m.message}</TableCell>
                                                <TableCell>{new Date(m.submittedAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleDeleteMessage(m._id)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">No messages found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>

                            </Table>
                        </div>

                        <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                            <Button variant="outlined" disabled>« Previous</Button>
                            <span style={{ margin: "0 10px" }}>Page 1</span>
                            <Button variant="outlined" disabled>Next »</Button>
                        </div>
                    </div>
                );

            default:
                return <h2>Dashboard Overview</h2>;
        }
    };

    return (
        <div className="admin-dashboard">
            <nav className='dashboard-nav'>
                <div className="logo">
                    <Link to="/home">
                        <img src={Logo} alt="Candles" className="logo-image" />
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
                                    <li><Link to="/Profile" className="view-profile-button">
                                        View Full Profile
                                    </Link></li>
                                </div>
                            )}
                        </li>
                    )}
                </ul>
            </nav>
            <div className="admin-dashboard-layout">
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
                            <li className={activeMenuItem === 'messages' ? 'active' : ''}
                                onClick={() => setActiveMenuItem('messages')}>
                                <a href="#messages">
                                    <i className="sidebar-icon">💬</i>
                                    <span className="sidebar-text">Messages</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={`admin-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                    <div className="admin-content-header">
                        <h1>Welcome {user?.name}</h1>
                        <p>Manage your platform, users, and courses from this central control panel.</p>
                    </div>
                    <div className="admin-content-body">
                        {renderContent()}
                    </div>
                    <CourseModal
                        isOpen={isCourseModalOpen}
                        onClose={() => setIsCourseModalOpen(false)}
                        course={currentCourse}
                        onSave={saveCourse}
                    />
                    <VideoModal
                        isOpen={isVideoModalOpen}
                        onClose={() => setIsVideoModalOpen(false)}
                        video={currentVideo}
                        onSave={saveVideo}
                    />
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
            <Footer />
        </div>
    );
};

export default AdminDashboard;