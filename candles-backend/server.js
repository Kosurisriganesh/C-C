require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Import routes
const enrollmentRoutes = require('./routes/enrol');
const courseRoutes = require('./routes/course');
const adminRoutes = require('./routes/admin');
const adminCoursesRoutes = require('./routes/adminCourses');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true
}));

// Body parser middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Candles', {})
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Models
const User = require('./models/User');
const Contact = require('./models/contact');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/admin/courses', adminCoursesRoutes);
app.use('/api/contact', require('./routes/contact'));



// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working fine!' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));