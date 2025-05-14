import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../Components/Firebase/firebase';
import { signOut } from 'firebase/auth';
import './user-details.css';

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Get additional user info from localStorage
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        setUserInfo({
          displayName: user.displayName || storedUserInfo.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL || 'https://via.placeholder.com/150',
          uid: user.uid,
          isGoogleUser: storedUserInfo.isGoogleUser || false
        });
      } else {
        // User is not logged in, redirect to login
        navigate('/login');
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="back-to-dashboard">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
      </div>
      
      <div className="profile-card">
        <div className="profile-info">
          <h2>User Profile</h2>
          <div className="profile-avatar">
            <img src={userInfo?.photoURL} alt="Profile" className="round-image" />
            {userInfo?.isGoogleUser && (
              <div className="google-badge" title="Google Account">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                  alt="Google" 
                />
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <div className="profile-field">
              <label>Name</label>
              <p>{userInfo?.displayName}</p>
            </div>
            
            <div className="profile-field">
              <label>Email</label>
              <p>{userInfo?.email}</p>
            </div>
            
            <div className="profile-field">
              <label>Account Type</label>
              <p>{userInfo?.isGoogleUser ? 'Google Account' : 'Email & Password'}</p>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="sign-out-button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
