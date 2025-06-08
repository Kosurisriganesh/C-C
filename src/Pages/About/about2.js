import React from 'react';
import { Link } from 'react-router-dom';
import ceo from '../../Assets/ceo.jpg';
import Footer from '../../Components/Footer/footer';
import './about2.css';

const About2 = () => (
    <div className="about-content">
        <nav className='dashboard-nav'>
            <div className="logo">
                <img src={process.env.PUBLIC_URL + '/c&c2 (2).jpg'} alt="Candles" className="logo-image" />
                <h2>CANDLES & CAPITALS</h2>
            </div>

            <ul className="nav-links">
                <li><Link to='/home'> HOME </Link></li>

                <li className="dropdown-container">
                    <span><Link to='/about'>ABOUT</Link></span>
                    <ul className="dropdown-menu">
                        <li><Link to='/about'>Our Story</Link></li>
                        <li><Link to='/about2'>About Karthik sir</Link></li>
                    </ul>
                </li>

                <li className="dropdown-container">
                    <span><Link to='/course'> COURSE</Link></span>
                    <ul className="dropdown-menu">
                        <li>Technical Analysis</li>
                        <li>Fundamental Analysis</li>
                        <li>Commodity Trading</li>
                        <li>Features & Option</li>
                    </ul>
                </li>

                <li><Link to='/contact'> CONTACT </Link></li>
                
                <li><Link to='/login'> LOGIN </Link></li>
            </ul>
        </nav>

        <div className='container'>
            <h2>About Our CEO / Founder</h2>
            <div className="ceo-content">
                <div className="ceo-text">
                    <h3>Karthik – Founder of Candles and Capital</h3>
                    <p>I'm Karthik, a passionate trader and educator based in Visakhapatnam, Andhra Pradesh. Like many dreamers, I've always aimed high—not just for personal success, but with a strong desire to make a meaningful impact in others' lives. My search for a career that aligned with both my aspirations and values led me through several professions, none of which truly fulfilled me.</p>
                    <p>Everything changed the day I saw a friend analyzing graphs and numbers moving across a screen. Curious, I asked him what it was. He introduced me to the world of the stock market—and I was instantly intrigued. I started trading right away and made some quick profits, which thrilled me. But soon after, I faced a significant loss that shook me to the core. The stress and panic I felt made me realize there was much more to trading than just luck—it required knowledge, discipline, and strategy.</p>
                    <p>From that moment on, I paused trading and committed myself to learning. I spent nearly two years studying the stock market, understanding the science behind price movements, and mastering technical analysis. Over time, my knowledge deepened, my strategies improved, and my confidence grew.</p>
                </div>
                <div className="ceo-image">
                    <img src={ceo} alt="Karthik - CEO" />
                    <p>Today, with over 8 years of hands-on experience, I've developed a deep understanding of market behavior and have crafted my own trading strategies. These strategies are not only profitable but also practical and teachable. So far, I've had the privilege of training over 200+ students, many of whom are now independently analyzing the markets and making informed trading decisions without relying on external tips or advice.</p>
                </div>
            </div>

            {/* Added Achievements Section */}
            <div className="achievements-section">
                <h3>Achievements & Expertise</h3>
                <div className="achievement-cards">
                    <div className="achievement-card">
                        <div className="achievement-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h4>8+ Years</h4>
                        <p>Of Active Trading Experience</p>
                    </div>
                    <div className="achievement-card">
                        <div className="achievement-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h4>200+</h4>
                        <p>Students Trained Successfully</p>
                    </div>
                    <div className="achievement-card">
                        <div className="achievement-icon">
                            <i className="fas fa-graduation-cap"></i>
                        </div>
                        <h4>Specialized</h4>
                        <p>In Technical Analysis</p>
                    </div>
                </div>
            </div>

            {/* Added Philosophy Section */}
            <div className="philosophy-section">
                <div className="philosophy-content">
                    <h3>My Trading Philosophy</h3>
                    <blockquote>
                        "Trading isn't about getting rich quick; it's about making consistent, informed decisions that compound over time. My mission is to empower traders with knowledge that transforms not just their portfolios, but their approach to financial freedom."
                    </blockquote>
                </div>
            </div>

            {/* Added Call to Action */}
            <div className="ceo-cta">
                <h3>Ready to Learn from Karthik?</h3>
                <p>Join our community of successful traders and take your first step toward financial independence.</p>
                <Link to="/login" className="cta-button">Explore Our Courses</Link>
            </div>
        </div>

        
        <Footer/>
        
    </div>
);

export default About2;
