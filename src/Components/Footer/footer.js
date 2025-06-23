import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import Logo from '../../Assets/Logo2.png';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-top">
                <div className="footer-column">
                    <div className="footer-logo">
                        <img src={Logo} alt="Candles & Capitals" />
                        <h3>CANDLES & CAPITALS</h3>
                    </div>
                    <p className="footer-description">
                        Empowering traders and investors with knowledge and strategies to navigate the financial markets with confidence.
                    </p>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/karthik_traderr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                        <a href="https://wa.me/+918019261006?text=Hi%20there!%20I%20saw%20your%20website." target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
                        <a href="https://www.youtube.com/@candlesandcapital" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
                
                <div className="footer-column">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/Home">Home</Link></li>
                        <li><Link to="/About">About Us</Link></li>
                        <li><Link to="/Course">Courses</Link></li>
                        <li><Link to="/Contact">Contact</Link></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h4>Our Courses</h4>
                    <ul className="footer-links">
                        <li><Link to="/Course">Technical Analysis</Link></li>
                        <li><Link to="/Course">Fundamental Analysis</Link></li>
                        <li><Link to="/Course">Commodity Trading</Link></li>
                        <li><Link to="/Course">Features & Options</Link></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h4>Contact Us</h4>
                    <ul className="contact-info">
                        <li>
                            <i className="fas fa-map-marker-alt contact-icon"></i>
                            <span>Opp.Apollo Pharmacy,Kanithi Road, Gajuwaka,Visakhapatnam, Andhra Pradesh.</span>
                        </li>
                        <li>
                            <i className="fas fa-phone contact-icon"></i>
                            <span>+91 8978131328</span>
                        </li>
                        <li>
                            <i className="fas fa-envelope contact-icon"></i>
                            <span>candlesandcapital@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="copyright">
                    <p>&copy; {new Date().getFullYear()} Candles & Capitals. All rights reserved.</p>
                </div>
                {/* <div className="footer-bottom-links">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms & Conditions</Link>
                    <Link to="/disclaimer">Disclaimer</Link>
                </div> */}
                <h3>Developed & Maintains by  <span><a href = "https://www.linkedin.com/in/kosuri-sri-ganesh"> Kosuri Sri Ganesh </a></span></h3>
            </div>
        </footer>
    );
};

export default Footer;
