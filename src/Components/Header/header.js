import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import Logo2 from '../../Assets/Logo2.png';

const Header = () => {
    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="logo">
                    <img src={Logo2} alt="Candles" className="logo-image" />
                     <h2>Candles & Capital</h2>
                </div>

                <ul className="nav-links">
                    <li><Link to='./home' > HOME </Link></li>
                    <li className="dropdown-container">
                        <span><Link to='./about' > ABOUT </Link></span>
                        <ul className="dropdown-menu">
                            <li><Link to='./about' > Our Story </Link></li>
                            <li><Link to='./about2' > About Karthik sir</Link></li>
                        </ul>
                    </li>
                
                    <li className="dropdown-container">
                        <span><Link to="/Course">COURSES</Link></span>
                        <ul className="dropdown-menu">
                            <li><Link to="/Course">Technical Analysis</Link></li>
                            <li><Link to="/Course">Fundamental Analysis</Link></li>
                            <li><Link to="/Course">Commodity Trading</Link></li>
                            <li><Link to="/Course">Features & Options</Link></li>
                        </ul>
                    </li>
                
                    <li><Link to='./contact' > CONTACT</Link></li>
                    
                    <li><Link to='./login'> 👤LOGIN </Link></li> 
                </ul>
            </nav>
        </div>
    );
};

export default Header;
