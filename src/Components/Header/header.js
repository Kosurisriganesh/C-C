import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Logo2 from '../../Assets/Logo2.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [courseOpen, setCourseOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('menu-open', !menuOpen);
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">
          <img src={Logo2} alt="Candles" className="logo-image" />
          <h2>CANDLES & CAPITAL</h2>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/home" onClick={toggleMenu}>HOME</Link></li>

          <li className={`dropdown-container ${aboutOpen ? 'open' : ''}`} onClick={() => setAboutOpen(!aboutOpen)}>
            <span>ABOUT</span>
            <ul className="dropdown-menu">
              <li><Link to="/about" onClick={toggleMenu}>Our Story</Link></li>
              <li><Link to="/about2" onClick={toggleMenu}>About Karthik sir</Link></li>
            </ul>
          </li>

          <li className={`dropdown-container ${courseOpen ? 'open' : ''}`} onClick={() => setCourseOpen(!courseOpen)}>
            <span>COURSES</span>
            <ul className="dropdown-menu">
              <li><Link to="/Course" onClick={toggleMenu}>Technical Analysis</Link></li>
              <li><Link to="/Course" onClick={toggleMenu}>Fundamental Analysis</Link></li>
              <li><Link to="/Course" onClick={toggleMenu}>Commodity Trading</Link></li>
              <li><Link to="/Course" onClick={toggleMenu}>Features & Options</Link></li>
            </ul>
          </li>

          <li><Link to="/contact" onClick={toggleMenu}>CONTACT</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>👤 LOGIN</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
