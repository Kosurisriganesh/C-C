// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/contact');

router.post('/', async (req, res) => {
  const { name, email, contact, message } = req.body;

  try {
    // Save to MongoDB
    const newMessage = new Contact({ name, email, contact, message });
    await newMessage.save();

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'candlesandcapital@gmail.com',      // your Gmail address
        pass:  'reepqwqdazxojrfu'      // your Gmail app password (16 chars, no spaces)
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Your Gmail address (authorized sender)
      replyTo: email,                // User's email for reply
      to: process.env.EMAIL_USER,    // Your Gmail address to receive messages
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nContact: ${contact}\n\nMessage:\n${message}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message submitted and email sent successfully.' });
  } catch (err) {
    console.error('Contact form submission failed:', err);
    if (err.response) {
      console.error('SMTP response:', err.response);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
