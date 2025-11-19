const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Environment variable for JWT secret (add to .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user (all new registrations are 'user' role by default)
    const user = new User({
      name,
      email,
      password
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
});

// Make admin (REMOVE THIS IN PRODUCTION - THIS IS ONLY FOR DEVELOPMENT)
router.get('/make-admin/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    
    // Find user and update role
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: `User with email ${userEmail} not found` });
    }
    
    res.json({ message: `User ${user.name} (${user.email}) is now an admin`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;