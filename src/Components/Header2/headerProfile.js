import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profilepic from '../../Assets/profilepic.jpg';
import Logo from '../../Assets/Logo2.png';
import './header2.css';

const HeaderWithProfile = ({
  menuOpen = false,
  setMenuOpen = () => {},
  openDropdown = null,
  toggleDropdown = () => {},
  closeMenu = () => {},
  courses = [],
  user = {},
  loading = false,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    if (!newState) toggleDropdown(null);
    document.body.classList.toggle('menu-open', newState);
  };

  const handleDropdownClick = (key) => {
    toggleDropdown(openDropdown === key ? null : key);
  };

  const handleProfileToggle = () => {
    setShowProfileDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowProfileDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="dashboard-nav">
      <div className="mobile-header-top">
        <div className="logo-title">
          <Link to="/home">
            <img src={Logo} alt="Candles" className="logo-image" />
          </Link>
          <h2 className="brand-title">Candles & Capital</h2>
        </div>
        <button
          onClick={handleMenuToggle}
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/home" onClick={closeMenu}>HOME</Link></li>

        <li className={`dropdown-container ${openDropdown === 'about' ? 'open' : ''}`}>
          <span className="nav-link-span" onClick={() => handleDropdownClick('about')}>ABOUT</span>
          <ul className={`dropdown-menu ${openDropdown === 'about' ? 'open' : ''}`}>
            <li><Link to="/about" onClick={closeMenu}>Our Story</Link></li>
            <li><Link to="/about2" onClick={closeMenu}>About Karthik Sir</Link></li>
          </ul>
        </li>

        <li className={`dropdown-container ${openDropdown === 'courses' ? 'open' : ''}`}>
          <span className="nav-link-span" onClick={() => handleDropdownClick('courses')}>COURSES</span>
          <ul className={`dropdown-menu ${openDropdown === 'courses' ? 'open' : ''}`}>
            {courses.length > 0 ? (
              courses.map(course => (
                <li key={course._id}>
                  <Link to={`/courses/${course._id}`} onClick={closeMenu}>{course.title}</Link>
                </li>
              ))
            ) : (
              <li>No Courses Available</li>
            )}
          </ul>
        </li>

        <li><Link to="/contact" onClick={closeMenu}>CONTACT</Link></li>

        {/* USER PROFILE SECTION */}
        <li className="profile-container" ref={dropdownRef}>
          {loading ? (
            <div className="user-profile-icon">
              <span className="profile-name">Loading...</span>
            </div>
          ) : (
            <div className="profile-trigger" onClick={handleProfileToggle}>
              <img
                src={user?.avatar || profilepic}
                alt={user?.name}
                className="profile-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profilepic;
                }}
              />
              <span>{user?.name || 'User'}</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          )}

          {!isMobile && showProfileDropdown && user && (
            <ul className="dropdown-menu profile-dropdown">
              <li className="profile-header">
                <strong>{user.name}</strong>
                <span className="profile-role">{user.role}</span>
              </li>
              <li><Link to="/Profile" onClick={() => setShowProfileDropdown(false)}>My Profile</Link></li>
              <li><Link to="/Course" onClick={() => setShowProfileDropdown(false)}>My Courses</Link></li>
              <li className="logout-option" onClick={handleLogout}>Logout</li>
            </ul>
          )}
        </li>
      </ul>

      {/* ✅ MOBILE PROFILE DROPDOWN OUTSIDE UL */}
      {isMobile && showProfileDropdown && user && (
        <div className="mobile-profile-dropdown">
          <div className="user-info-card mobile-user-info">
            <h2>Your Account</h2>
            <div className="user-info-details">
              <div className="user-info-avatar">
                <img
                  src={user?.avatar || profilepic}
                  alt="User Avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = profilepic;
                  }}
                />
              </div>
              <div className="user-info-text">
                <p><strong>Name:</strong> {user?.name || 'User'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Role:</strong> {user?.role || 'User'}</p>
              </div>
            </div>
            <Link to="/Profile" className="view-profile-button" onClick={() => setShowProfileDropdown(false)}>View Profile</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HeaderWithProfile;
