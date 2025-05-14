import React from 'react';
import './about.css';

const About = () => (
    <div className="tab-content">
        <h2>About Us</h2>
        <div className="about-content">
            <div className="about-image">
                <div className="placeholder-image">
                <img src={process.env.PUBLIC_URL + '/candles.jpg'} alt="Candles" className="logo-image" />
                </div>
            </div>
            <div className="about-text">
                <p>Our team of expert traders and educators provide practical knowledge that bridges the gap between theory and real-world trading.</p>
                <p>Our mission is to empower traders of all levels with the skills, strategies, and mindset needed to succeed in today's dynamic markets.</p>
                <div className="stats">
                    <div className="stat-item">
                        <h3>10,000+</h3>
                        <p>Students</p>
                    </div>
                    <div className="stat-item">
                        <h3>25+</h3>
                        <p>Expert Instructors</p>
                    </div>
                    <div className="stat-item">
                        <h3>50+</h3>
                        <p>Courses</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default About;