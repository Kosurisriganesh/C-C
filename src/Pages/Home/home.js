import React from 'react';
import { Link } from 'react-router-dom';
import technicalanalysis from '../../Assets/technical analysis.jpg';
import fa from '../../Assets/fa.jpg';
import ct from '../../Assets/ct.jpg';
import Header from '../../Components/Header/header.js';
import Footer from '../../Components/Footer/footer.js';
import './home.css';

const Home = () => {
    return(
        <div className="dashboard-container">
            <Header />
            
            <div className="dashboard-header">
                <div className="hero-section">
                    <div className='hero-content'>
                        <h1>Studying <span>Online is now much easier</span></h1>
                        <p>Candles & Capitals is an intersting platform that will teach you in more an interactive way</p>
                        <br/>
                        <Link to='./register'>
                            <button className='hero-button'> Join for free </button>
                        </Link>
                        <div className="animated-heading-container">
                            <h2 className="animated-heading">BEST STOCK MARKET TRAINING ACADEMY</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className='Course-cover'>
                <h3> COURSES OFFERED </h3>
                <p>We Offer Following Stock Trading Courses</p>
    
                <div className='course-cards'>
                    <div className='course-card'>
                        <img src={technicalanalysis} alt='technical analysis'/>
                        <div className="course-card-content">
                            <h2> Trading  - Technical Analysis  </h2>
                            <p>Technical Analysis involves studying historical price charts and trading volumes to predict future market movements.It uses tools like candlestick patterns, trend lines, and indicators (e.g., RSI, MACD) to identify entry and exit points.</p>
                            <button><Link to="/login">View Details</Link></button>
                        </div>
                    </div>
                    
                    <div className='course-card'>
                        <img src={fa} alt='Fundamental analysis'/>
                        <div className="course-card-content">
                            <h2> Trading - Fundamental Analysis  </h2>
                            <p>Fundamental Analysis helps investors evaluate a company's intrinsic value by examining financial statements, management, and industry conditions.
                                It identifies whether a stock is overvalued  guiding long-term investment decisions.</p>
                            <button><Link to="/login">View Details</Link></button>
                        </div>
                    </div>
                    
                    <div className='course-card'>
                        <img src={ct} alt='Commodity Trading' />
                        <div className="course-card-content">
                            <h2> Trading - Commodity Trading </h2>
                            <p>Commodity Trading involves buying and selling raw materials like gold, oil, agricultural products, and metals.
                                Prices are influenced by global supply-demand dynamics, geopolitical events, and economic indicators, making it popular among investors and traders.</p>
                            <button><Link to="/login">View Details</Link></button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='About'>
                <div className='About-content'>
                    <p>About us</p>
                    <h3>Best Stock Market Institute in India - <span> Candles & Capitals (C&C) </span></h3>
                </div>
                <div className='About-matter'>
                    <p>Welcome to Candles & Capitals (C&C) — India's Leading Stock Market Learning Hub At Candles & Capitals, we are committed to shaping the next generation of traders and investors through high-quality, practical stock market education. As a top-tier institute in India, we specialize in delivering in-depth training on stock market strategies, technical and fundamental analysis, and effective risk management.</p> <br/>
                    <p>Our expertly crafted programs are tailored to provide learners with real-world insights and hands-on experience, helping them confidently navigate market fluctuations and seize profitable opportunities. Whether you're just starting out or looking to enhance your trading skills, C&C is your trusted partner in building financial expertise and market mastery.</p>
                </div>
                <button className='button'><Link to="/about">About more</Link></button> <br/>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
