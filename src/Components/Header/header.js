import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Logo2 from '../../Assets/Logo2.png';

const Header = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setMenuOpen(false);
                setOpenDropdown(null);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
        document.body.classList.remove('menu-open');
    };

    const hamburgerLine = {
        width: '25px',
        height: '3px',
        background: '#f0a500',
        borderRadius: '2px',
        margin: '3px 0',
        transition: 'all 0.3s ease',
    };

    const navMobileStyle = {
        flexDirection: 'column',
        alignItems: 'flex-start',
        background: 'white',
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        padding: '1rem 0',
    };

    return (
        <div className="dashboard">
            <nav className="dashboard-nav" style={isMobile ? { paddingRight: '1rem' } : {}}>
                <div
                    className="logo"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={Logo2}
                            alt="Candles"
                            className="logo-image"
                            style={isMobile ? { height: '40px', width: '40px' } : {}}
                        />
                        <h2 style={isMobile ? { fontSize: '1rem', marginLeft: '10px' } : {}}>
                            Candles & Capital
                        </h2>
                    </div>

                    {isMobile && (
                        <button
                            onClick={() => {
                                setMenuOpen(!menuOpen);
                                setOpenDropdown(null);
                                document.body.classList.toggle('menu-open', !menuOpen);
                            }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                zIndex: 200,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '40px',
                                height: '40px',
                            }}
                        >
                            <span style={hamburgerLine}></span>
                            <span style={hamburgerLine}></span>
                            <span style={hamburgerLine}></span>
                        </button>
                    )}
                </div>

                <ul
                    className={`nav-links ${menuOpen ? 'open' : ''}`}
                    style={isMobile ? (menuOpen ? navMobileStyle : { display: 'none' }) : {}}
                >
                    <li><Link to="/home" onClick={closeMenu}>HOME</Link></li>

                    <li className={`dropdown-container ${openDropdown === 'about' ? 'open' : ''}`}>
                        <span
                            className="nav-link-span"
                            onClick={(e) => {
                                if (isMobile) {
                                    e.stopPropagation();
                                    toggleDropdown('about');
                                }
                            }}
                        >
                            ABOUT
                        </span>

                        <ul className={`dropdown-menu ${!isMobile ? '' : openDropdown === 'about' ? 'open' : ''}`}>
                            <li><Link to="/about" onClick={closeMenu}>Our Story</Link></li>
                            <li><Link to="/about2" onClick={closeMenu}>About Karthik sir</Link></li>
                        </ul>
                    </li>

                    <li className={`dropdown-container ${openDropdown === 'courses' ? 'open' : ''}`}>
                        <span
                            className="nav-link-span"
                            onClick={(e) => {
                                if (isMobile) {
                                    e.stopPropagation();
                                    toggleDropdown('courses');
                                }
                            }}
                        >
                            COURSES
                        </span>

                        <ul className={`dropdown-menu ${!isMobile ? '' : openDropdown === 'courses' ? 'open' : ''}`}>
                            <li><Link to="/Course" onClick={closeMenu}>Technical Analysis</Link></li>
                            <li><Link to="/Course" onClick={closeMenu}>Fundamental Analysis</Link></li>
                            <li><Link to="/Course" onClick={closeMenu}>Commodity Trading</Link></li>
                            <li><Link to="/Course" onClick={closeMenu}>Features & Options</Link></li>
                        </ul>
                    </li>

                    <li><Link to="/contact" onClick={closeMenu}>CONTACT</Link></li>
                    <li><Link to="/login" onClick={closeMenu}>👤LOGIN</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Header;
