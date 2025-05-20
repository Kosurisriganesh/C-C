const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Test endpoint to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Candles', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// Define User model schema
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
app.post('/api/auth/register', async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;
  
  console.log('Registration attempt for:', email);

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      fullName,
      phoneNumber,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log('Saving new user to database...');
    // Save user to database
    await user.save();
    console.log('User saved successfully');

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    console.log('Signing JWT token...');
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ message: 'Error creating token' });
        }
        console.log('Registration successful, returning token');
        return res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error details:', err);
    // Make sure to return JSON, not plain text
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt for:', email);

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    console.log('Signing JWT token for login...');
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ message: 'Error creating token' });
        }
        console.log('Login successful for:', email);
        return res.json({ 
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error details:', err);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// @route   POST api/auth/google-auth
// @desc    Handle Google authentication
// @access  Public
app.post('/api/auth/google-auth', async (req, res) => {
  const { email, fullName, uid } = req.body;
  
  console.log('Google auth attempt for:', email);

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Creating new user from Google auth:', email);
      // Create new user if doesn't exist
      user = new User({
        fullName,
        email,
        phoneNumber: '',  // Google auth might not provide phone number
        password: uid + (process.env.GOOGLE_SECRET_SALT || 'google_salt') // Create a password they won't use
      });

      // Save user to database
      await user.save();
      console.log('Google user saved successfully');
    } else {
      console.log('Existing user found for Google auth:', email);
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    console.log('Signing JWT token for Google auth...');
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'mysecrettoken',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          console.error('JWT Sign Error:', err);
          return res.status(500).json({ message: 'Error creating token' });
        }
        console.log('Google auth successful for:', email);
        return res.json({ 
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber
          }
        });
      }
    );
  } catch (err) {
    console.error('Google auth error details:', err);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error: ' + err.message });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
