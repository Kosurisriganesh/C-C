import React from 'react';
import './contact.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faLocationDot, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';


const Contact = () => (
        <div className="tab-content">
            <h2>Get a Call Back</h2>
            
            <div className="contact-container">
                <div className="contact-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="name">Name :</label>
                            <input type="text" id="name" placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email :</label>
                            <input type="email" id="email" placeholder="Your Email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Contact ">Contact No :</label>
                            <input type="tel" id="contact" placeholder="Your Contact" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="message">Message :</label>
                            <textarea id="message" rows="5" placeholder="Your Message"></textarea>
                        </div>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
                 <div className="contact-info">
                    <h3>Get in touch with us</h3>
                    <p>If you have business inquiries or other questions, please fill out the following form to contact us. Thank you.  </p>
                    <h3>Contact</h3>
                    <p><strong><FontAwesomeIcon icon={faPhone} /> </strong>+91-8978131328</p>
                    <p><strong><FontAwesomeIcon icon={faEnvelope} /> </strong> candlesandcapital@gmail.com</p>
                    <p><strong><FontAwesomeIcon icon={faLocationDot} /> </strong> Opp . Apollo Pharmacy Kanithi Road, Gajuwaka,Visakhapatnam - 530026</p>
                    
                    <div className="social-links">
                        
                        <a href="#" className="social-icon"> <FontAwesomeIcon icon={faWhatsapp} /> </a> 
                        <a href="#" className="social-icon"> <FontAwesomeIcon icon={faInstagram} /> </a>

                    </div>
            </div>
                
                
            </div>
            
             <br/>

           
        </div>
    );
export default Contact