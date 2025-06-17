import React from 'react';
import about from '../../Assets/about1.jpg';
import Header from '../../Components/Header/header';
import Footer from '../../Components/Footer/footer';
import './about.css';

const About = () => (
    <div className="about-content">
        
        <Header />
    
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

        <Footer/>

       
    </div>
);

export default About;
