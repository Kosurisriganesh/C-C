// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Import the Contact model
const adminAuth = require('../middleware/adminAuth'); // Import the admin auth middleware

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public (no authentication required)
router.post('/', async (req, res) => {
    const { name, email, occupation, contact, message } = req.body;

    // Basic validation for required fields
    if (!name || !email || !occupation || !contact || !message) { // Occupation is required based on your model
        return res.status(400).json({ message: 'All fields (name, email, occupation, contact, message) are required.' });
    }

    try {
        // Create a new contact message instance
        const newMessage = new Contact({
            name,
            email,
            occupation,
            contact,
            message
        });

        // Save the message to the database
        await newMessage.save();

        // Respond with success message
        res.status(200).json({ message: 'Message submitted successfully.', data: newMessage });
    } catch (err) {
        console.error('Contact form submission failed:', err);
        // Respond with a server error if something goes wrong
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/contact/submissions
// @desc    Fetch all contact submissions for the admin dashboard
// @access  Private (Admin only - requires adminAuth middleware)
router.get('/submissions', adminAuth, async (req, res) => {
    try {
        // Find all contact submissions, sorted by submittedAt in descending order (newest first)
        const submissions = await Contact.find().sort({ submittedAt: -1 });
        // Respond with the fetched submissions
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/contact/submissions/:id
// @desc    Delete a specific contact submission by ID
// @access  Private (Admin only - requires adminAuth middleware)
router.delete('/submissions/:id', adminAuth, async (req, res) => {
    try {
        const messageId = req.params.id; // Get the message ID from the URL parameters

        // Find and delete the message by its ID
        const deletedMessage = await Contact.findByIdAndDelete(messageId);

        // If no message was found with the given ID
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        // Respond with success message
        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error deleting message:', error);
        // Handle invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid message ID format.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;