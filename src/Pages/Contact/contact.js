import React, { useState } from 'react';
import './contact.css';  
import contact from '../../Assets/contact.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    message: ''
  });

  const [responseMessage, setResponseMessage] = useState('');

  const contactInfo = {
    phone: '+91 8978131328',
    email: 'candlesandcapital@gmail.com',
    address: 'Opp. Apollo Pharmacy Kanithi Road, Gajuwaka, Visakhapatnam - 530026'
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResponseMessage(''); // Clear previous messages

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'  // remove if backend doesn't use cookies/auth
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage(data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', contact: '', message: '' });
      } else {
        setResponseMessage(data.message || 'Failed to send message.');
      }
    } catch (err) {
      console.error('Error sending contact form:', err);
      setResponseMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="tab-content">
      <h2>Get a Call Back</h2>

      <div className="contact-container">
        <div className="contact-form">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Name :</label>
              <input
                type="text"
                id="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact">Contact No :</label>
              <input
                type="tel"
                id="contact"
                placeholder="Your Contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message :</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>

          {responseMessage && <p className="response-message">{responseMessage}</p>}
        </div>

        <div className="contact-right-section">
          <div className="contact-image-container">
            <img
              src={contact}
              alt="Contact Information"
              className="contact-image"
            />
          </div>
          <div className="contact-additional-info">
            <h3>Contact Information</h3>
            <p><strong><FontAwesomeIcon icon={faPhone} /> </strong>{contactInfo.phone}</p>
            <p><strong><FontAwesomeIcon icon={faEnvelope} /> </strong> {contactInfo.email}</p>
            <p><strong><FontAwesomeIcon icon={faLocationDot} /> </strong> {contactInfo.address}</p>

            <div className="social-links">
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faWhatsapp} /></a>
              <a
                href="https://www.instagram.com/karthik_traderr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                className="social-icon"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <br />
    </div>
  );
};

export default Contact;
