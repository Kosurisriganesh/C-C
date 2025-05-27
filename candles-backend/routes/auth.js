const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, isAdmin } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      fullName,
      phoneNumber,
      email,
      password,
      isAdmin: isAdmin || false // default false if not provided
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    // JWT payload
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        
        // Define role and redirect URL
        const role = isAdmin ? 'admin' : 'user';
        const redirectUrl = isAdmin ? '/admin/dashboardadmin' : '/dashboard';
        
        res.json({ token, role, redirectUrl });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };


    
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;

        console.log("Payload", payload);
        
        const role = payload.user.isAdmin ? 'admin' : 'user';
        const redirectUrl = payload.user.isAdmin ? '/admin/dashboard' : '/dashboard';
        
        res.json({  payload, token, role, redirectUrl });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/google-auth
// @desc    Handle Google authentication
// @access  Public
router.post('/google-auth', async (req, res) => {
  try {
    const { email, fullName, uid, emailVerified, isAdmin } = req.body;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        fullName,
        email,
        phoneNumber: '',
        password: '',
        isAdmin: isAdmin || false,
        googleId: uid
      });
      
      await user.save();
    }
    
    const payload = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        
        const role = user.isAdmin ? 'admin' : 'user';
        const redirectUrl = user.isAdmin ? '/admin/dashboard' : '/dashboard';
        
        res.json({ token, role, redirectUrl });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
