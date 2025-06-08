import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../Pages/Firebase/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import './user-details.css';
import profilepic from '../../Assets/profilepic.jpg'; // Use your actual path

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editing state
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        // Fallback for name
        let fallbackName = "User";
        if (user.email) fallbackName = user.email.split('@')[0];

        const displayName =
          user.displayName ||
          storedUserInfo.displayName ||
          fallbackName ||
          "User";

        // Fallback for avatar
        const photoURL =
          user.photoURL ||
          storedUserInfo.photoURL ||
          profilepic;

        setUserInfo({
          displayName,
          email: user.email,
          photoURL,
          uid: user.uid,
          isGoogleUser: storedUserInfo.isGoogleUser || user.providerData[0]?.providerId === 'google.com'
        });
        setEditName(displayName);
      } else {
        navigate('/login');
      }
      setLoading(false);
    });
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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditName(userInfo.displayName);
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);

    if (!editName.trim()) {
      alert('Name cannot be empty.');
      setSaving(false);
      return;
    }

    if (!auth.currentUser) {
      alert('User not authenticated.');
      setSaving(false);
      return;
    }

    // For Google accounts, editing is not allowed
    if (userInfo.isGoogleUser) {
      alert("Google account details must be updated from your Google Account settings.");
      setSaving(false);
      setEditMode(false);
      return;
    }

    try {
      // Only update the displayName, don't change the photoURL
      await updateProfile(auth.currentUser, {
        displayName: editName.trim(),
        photoURL: userInfo.photoURL
      });

      // Update local state and localStorage
      const updatedUserInfo = {
        ...userInfo,
        displayName: editName.trim()
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setEditMode(false);
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="back-to-dashboard">
        <Link to="/dashboard" className="back-link">← Back to Dashboard </Link>
      </div>
      <div className="profile-card">
        <div className="profile-info">
          <h2>User Profile</h2>
          <div className="profile-avatar">
            <img
              src={userInfo?.photoURL}
              alt="Profile"
              className="round-image"
              onError={e => { e.target.onerror = null; e.target.src = profilepic; }}
            />
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
              {editMode ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={userInfo?.isGoogleUser}
                />
              ) : (
                <p>{userInfo?.displayName}</p>
              )}
            </div>
            <div className="profile-field">
              <label>Email</label>
              <p>{userInfo?.email}</p>
            </div>
            <div className="profile-field">
              <label>Account Type</label>
              <p>{userInfo?.isGoogleUser ? 'Google Account' : 'Email & Password'}</p>
            </div>
            <div className="profile-field">
              <label>Profile Picture</label>
              {editMode && userInfo?.isGoogleUser && (
                <p>Profile picture must be changed via your Google Account.</p>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {editMode ? (
              <>
                <button
                  className="save-button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="edit-button" onClick={handleEdit}>
                  Edit Profile
                </button>
                <button className="sign-out-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;