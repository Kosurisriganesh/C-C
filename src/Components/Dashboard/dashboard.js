import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../Components/Firebase/firebase';
import { signOut } from 'firebase/auth';
import './dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    
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
            } else {
                // No user is signed in, redirect to login
                navigate('/login');
            }
            setLoading(false);
        });
        
        // Cleanup subscription
        return () => unsubscribe();
    }, [navigate]);
    
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
                    <h2>CANDLES & CAPITALS</h2>
                </div>
                <ul className="nav-links">
                    <li><Link to="/home">HOME</Link></li>
                    <li><Link to="/about">ABOUT</Link></li>
                    <li><Link to="/contact">CONTACT</Link></li>
                    
                    <li className="dropdown-container">
                        <span>COURSES</span>
                        <ul className="dropdown-menu">
                            <li><Link to="/courses/beginner">Beginner Course</Link></li>
                            <li><Link to="/courses/intermediate">Intermediate Course</Link></li>
                            <li><Link to="/courses/advanced">Advanced Course</Link></li>
                            <li><Link to="/courses/premium">Premium Workshops</Link></li>
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
                                    <li><Link to="/my-courses" onClick={() => setShowProfileDropdown(false)}>My Courses</Link></li>
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
                
                {/* Dashboard content would go here */}
                
                {/* Display user information */}
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
                            <p><strong>Name:</strong> {user?.name}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>Account Type:</strong> {user?.role}</p>
                        </div>
                    </div>
                    <Link to="/Profile" className="view-profile-button">
                        View Full Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
