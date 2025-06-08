const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to return user object without sensitive info
function userResponse(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin
  };
}

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password, isAdmin } = req.body;
    const emailLower = email.toLowerCase();

    // Check if user already exists
    let user = await User.findOne({ email: emailLower });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Make sure isAdmin is boolean, default to false
    const adminFlag = !!isAdmin;

    // Create new user
    user = new User({
      fullName,
      phoneNumber,
      email: emailLower,
      password,
      isAdmin: adminFlag
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
        if (err) return res.status(500).json({ message: 'JWT error' });
        const redirectUrl = user.isAdmin ? '/dashboardadmin' : '/dashboard';
        res.json({
          token,
          user: userResponse(user),
          isAdmin: user.isAdmin,
          redirectUrl
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Only check password for users who have it (i.e., not Google users)
    if (!user.password) {
      return res.status(400).json({ message: 'Please login with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set status to active
    await User.findByIdAndUpdate(user._id, { status: true });

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
        if (err) return res.status(500).json({ message: 'JWT error' });
        const redirectUrl = user.isAdmin ? '/dashboardadmin' : '/dashboard';
        res.json({
          token,
          user: userResponse(user),
          isAdmin: user.isAdmin,
          redirectUrl
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/logout
// @desc    Logout user and set status to inactive

router.post('/logout', async (req, res) => {
    const { userId } = req.body;
    console.log('Logout for userId:', userId);
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { status: false }, { new: true });
        console.log('Updated User:', updatedUser);
        res.json({ message: 'User status updated to inactive.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});;

// @route   POST api/auth/google-auth
// @desc    Handle Google authentication
// @access  Public
router.post('/google-auth', async (req, res) => {
  try {
    const { email, fullName, uid, emailVerified, isAdmin } = req.body;
    const emailLower = email.toLowerCase();

    let user = await User.findOne({ email: emailLower });

    if (!user) {
      user = new User({
        fullName,
        email: emailLower,
        phoneNumber: '',
        password: '',
        isAdmin: !!isAdmin,
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
        if (err) return res.status(500).json({ message: 'JWT error' });
        const redirectUrl = user.isAdmin ? '/dashboardadmin' : '/dashboard';
        res.json({
          token,
          user: userResponse(user),
          isAdmin: user.isAdmin,
          redirectUrl
        });
      }
    );
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



module.exports = router;