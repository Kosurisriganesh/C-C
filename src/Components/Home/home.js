import React from 'react';
import { Link } from 'react-router-dom';
import bg from'../../Assets/bg.svg';
import technicalanalysis from '../../Assets/technical analysis.png';
import fa from '../../Assets/fa.jpg';
import './home.css';

const Home = () => {
    return(
        <div className="dashboard-container">
            <div className="dashboard-header">
            
                <nav className="dashboard-nav">
                
                    <div className="logo">
                        <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles" className="logo-image" />
                        <h2>CANDLES & CAPITALS</h2>
                    </div>

                    <ul className="nav-links">
                        <li>HOME</li>
                    
                        <li className="dropdown-container">
                            <span>COURSE</span>
                            <ul className="dropdown-menu">
                            <li>Beginner Course</li>
                            <li>Intermediate Course</li>
                            <li>Advanced Course</li>
                            <li>Premium Workshops</li>
                            </ul>
                        </li>
                    
                        <li className="dropdown-container">
                            <span>ABOUT</span>
                            <ul className="dropdown-menu">
                            <li>Our Story</li>
                            <li>About Karthik</li>
                            
                            </ul>
                        </li>
                    
                        <li><Link to='./contact' > CONTACT</Link></li>
                        
                        <li><Link to='./login'> 👤LOGIN </Link></li> 
                    
                    </ul>
                </nav>
                <div>
                    <div className="hero-section">
                        <div className='hero-content'>

                        <h1>Studying <span>Online is now much easier</span></h1>
                        <p>Candles & Capitals is an intersting platform that will teach you in more an interactive way</p>
                        <br/>
                        <Link to='./register'>
                            <button className='hero-button'> Join for free </button>
                        </Link>
                    </div>

                     <img src={bg} alt="" style={{width: '30%', height: 'auto'}}/>
                    <img src={process.env.PUBLIC_URL + '/img.jpg'} alt="" className="" style={{width: '30%', height: 'auto'}} />
                 </div>
               </div>
            </div>

            <div className='Course-cover'>
                <h3>OUR COURSES</h3>
                <p>We Offer Following Stock Trading Courses</p>
    
                {/* SINGLE course-cards container with BOTH cards inside */}
                <div className='course-cards'>
                    {/* First card - Technical Analysis */}
                    <div className='course-card'>
                        <img src={technicalanalysis} alt='technical analysis'/>
                            <div className="course-card-content">
                                <h2> Trading In The Zone - Technical Analysis Course </h2>
                                <p>This course is designed for those who want to become a Full-Time Trader and earn money by regular trading in the stock market.</p>
                                <button>View Details</button>
                            </div>
                    </div>
                    
                    {/* Second card - Fundamental Analysis */}
                    <div className='course-card'>
                        <img src={fa} alt='Fundamental analysis'/>
                            <div className="course-card-content">
                                <h2> Trading - Fundamental Analysis Course </h2>
                                <p>This course is designed for those who want to become a Full-Time Trader and earn money by regular trading in the stock market.</p>
                                <button>View Details</button>
                        </div>
                    </div>
                </div>
            </div>

          

            {/* Advanced Footer */}
            <footer className="site-footer">
                <div className="footer-top">
                    <div className="footer-column">
                        <div className="footer-logo">
                            <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles & Capitals" />
                            <h3>CANDLES & CAPITALS</h3>
                        </div>
                        <p className="footer-description">
                            Empowering traders and investors with knowledge and strategies to navigate the financial markets with confidence.
                        </p>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook"></i></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter"></i></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram"></i></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-linkedin"></i></a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fa fa-youtube"></i></a>
                        </div>
                    </div>
                    
                    <div className="footer-column">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/courses">Courses</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h4>Our Courses</h4>
                        <ul className="footer-links">
                            <li><Link to="/courses/beginner">Beginner Trading</Link></li>
                            <li><Link to="/courses/intermediate">Intermediate Strategies</Link></li>
                            <li><Link to="/courses/advanced">Advanced Analysis</Link></li>
                            <li><Link to="/courses/premium">Premium Workshops</Link></li>
                            <li><Link to="/courses/mentorship">1-on-1 Mentorship</Link></li>
                        </ul>
                    </div>
                    
                    <div className="footer-column">
                        <h4>Contact Us</h4>
                        <ul className="contact-info">
                            <li>
                                <i className="fa fa-map-marker contact-icon"></i>
                                <span>123 Trading Street, Financial District, Mumbai, India</span>
                            </li>
                            <li>
                                <i className="fa fa-phone contact-icon"></i>
                                <span>+91 98765 43210</span>
                            </li>
                            <li>
                                <i className="fa fa-envelope contact-icon"></i>
                                <span>info@candlesandcapitals.com</span>
                            </li>
                        </ul>
                        <div className="newsletter">
                            <h5>Subscribe to our newsletter</h5>
                            <div className="newsletter-form">
                                <input type="email" placeholder="Your email address" />
                                <button type="submit">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <div className="copyright">
                        <p>&copy; {new Date().getFullYear()} Candles & Capitals. All rights reserved.</p>
                    </div>
                    <div className="footer-bottom-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms-of-service">Terms of Service</Link>
                        <Link to="/disclaimer">Disclaimer</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
