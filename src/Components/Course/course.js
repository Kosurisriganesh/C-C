import React from 'react';
import './course.css';
const Course = () => (
    <div className="tab-content">
        <h2>Our Stock Market Courses</h2>
        <div className="course-list">
            <div className="course-item">
                <h3>Stock Market Fundamentals</h3>
                <p>Learn the basics of stock markets, indices, and trading principles</p>
                <div className="course-details">
                    <span> Duration: 4 weeks </span>
                    <span> Level: Beginner </span>
                    <button className="enroll-btn"> Enroll Now </button>
                </div>
            </div>
            <div className="course-item">
                <h3>Technical Analysis Masterclass</h3>
                <p>Advanced chart patterns, indicators and trading strategies</p>
                <div className="course-details">
                    <span> Duration: 6 weeks </span>
                    <span> Level: Intermediate </span>
                    <button className="enroll-btn"> Enroll Now </button>
                </div>
            </div>
            <div className="course-item">
                <h3>Risk Management & Portfolio Building</h3>
                <p>Learn to manage risk and build a diversified investment portfolio</p>
                <div className="course-details">
                    <span> Duration: 5 weeks </span>
                    <span> Level: Advanced </span>
                    <button className="enroll-btn"> Enroll Now </button>
                </div>
            </div>
        </div>
    </div>
);

export default Course;