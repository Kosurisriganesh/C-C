import React from 'react';
import { Link } from 'react-router-dom';
import about from '../../Assets/about1.jpg';
import './about.css';

const About = () => (
    <div className="about-content">
        <nav className='dashboard-nav'>
            <div className="logo">
                <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles" className="logo-image" />
                <h2>CANDLES & CAPITALS</h2>
            </div>

            <ul className="nav-links">
                <li><Link to='./home' > HOME </Link></li>

                <li className="dropdown-container">
                    <span><Link to="/about">ABOUT</Link></span>
                    <ul className="dropdown-menu">
                        <li><Link to="/about">Our Story</Link></li>
                        <li><Link to="/about2">About Karthik sir</Link></li>
                    </ul>
                </li>

                <li className="dropdown-container">
                    <span><Link to="/course">COURSES</Link></span>
                    <ul className="dropdown-menu">
                        <li>Technical Analysis</li>
                        <li>Fundamental Analysis</li>
                        <li>Commodity Trading</li>
                        <li>Features & Option</li>
                    </ul>
                </li>

                <li><Link to='./contact' > CONTACT</Link></li>

                <li><Link to='/login'> LOGIN </Link></li>
            </ul>
        </nav>
        <br/>
        <br/>
        <br/>
        <div className='container'>
            <div className='about-container'>
                <h2>About Us</h2>
                <p>A Journey From A Single Student To Elementary Users.</p>
                <div className="about-content">
                    <div className="about-image">
                        <div className="placeholder-image">
                            <img src={about} alt='teach'/>
                        </div>
                    </div>
                    <div className="about-text">
                        <h3>Our Mission</h3>
                        <p>At Candles and Capital, we believe that understanding the stock market shouldn't be reserved for the few—it should be accessible, practical, and empowering for anyone with the ambition to learn.</p>
                        <p>Whether you're just starting out or looking to refine your strategy, we provide the tools, training, and support you need to trade with clarity and confidence.</p>
                        <h3>Our Approach</h3>
                        <p>We combine technical expertise with practical knowledge, focusing on real-world applications rather than just theory. Our teaching methodology emphasizes hands-on learning and actionable strategies that you can implement immediately.</p>
                    </div>
                </div>
                <div className="stats">
                    <div className="stat-item">
                        <h3>Who We Are</h3>
                        <p>Candles and Capital was founded by passionate traders and educators with a mission to simplify stock market education. With a strong focus on candlestick analysis and capital management, we blend technical expertise with real-world insights to help you succeed in today's fast-moving markets.</p>
                    </div>
                    <div className="stat-item">
                        <h3>What We Offer</h3>
                        <p>- Beginner to Advanced Courses – Learn the fundamentals or dive into advanced trading strategies.
                            - Live Webinars & Market Analysis – Stay updated and practice real-time decision-making.
                            - Candlestick Pattern Mastery – Understand market psychology through powerful visual tools.
                            - Community & Mentorship – Learn with a supportive network of traders and mentors.
                            - Risk & Capital Management – Trade smart by protecting what matters most—your capital.
                        </p>
                    </div>
                    <div className="stat-item">
                        <h3>Why Choose Us?</h3>
                        <p>- Clear, Actionable Learning – No jargon. Just practical knowledge you can apply.
                            - Trader-Led Education – Learn from professionals who trade what they teach.
                            - Results-Oriented Training – Focused on developing profitable habits, not just theories.
                            - Flexible & Self-Paced – Learn anytime, anywhere, at your convenience.
                        </p>
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

                        <a href="https://www.instagram.com/karthik_traderr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                        <a href="" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
                        <a href="https://www.youtube.com/@candlesandcapital" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/Home">Home</Link></li>
                        <li><Link to="/About">About Us</Link></li>
                        <li><Link to="/Courses">Courses</Link></li>
                        <li><Link to="/Contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Our Courses</h4>
                    <ul className="footer-links">
                        <li><Link to="/courses/">Technical Analysis</Link></li>
                        <li><Link to="/courses/">Fundamental Analysis</Link></li>
                        <li><Link to="/courses/">Commodity Trading</Link></li>
                        <li><Link to="/courses/">Features & Options</Link></li>

                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Contact Us</h4>
                    <ul className="contact-info">
                        <li>
                            <i className="fas fa-map-marker-alt contact-icon"></i>
                            <span>Opp.Apollo Pharmacy,Kanithi Road, Gajuwaka,Visakhapatnam.</span>
                        </li>
                        <li>
                            <i className="fas fa-phone contact-icon"></i>
                            <span>++91 8978131328</span>
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
                <div className="footer-bottom-links">
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms of Service</Link>
                    <Link to="/disclaimer">Disclaimer</Link>
                </div>
                <h3>Developed by Ganesh</h3>
            </div>

        </footer>
    </div>
);

export default About;
