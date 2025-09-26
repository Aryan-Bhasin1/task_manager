const express = require('express');
const jwt = require('jsonwebtoken');          // For creating JWT tokens
const bcrypt = require('bcryptjs');           // For hashing + comparing passwords
const User = require('../models/User');       // Mongoose User model
const router = express.Router();

// =============================
// REGISTER ROUTE
// =============================
// POST /api/auth/register
// Creates a new user account with a hashed password
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // 1. Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).send('User already exists');

  // 2. Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create and save the new user
  const user = new User({ username, password: hashedPassword });
  await user.save();

  // 4. Respond with success
  res.status(201).send('User created');
});

// =============================
// LOGIN ROUTE
// =============================
// POST /api/auth/login
// Authenticates user and returns a signed JWT token
router.post('/login', async (req, res) => {
  console.log("Login attempt:", req.body); // 👈 log incoming credentials

  const user = await User.findOne({ username: req.body.username });
  console.log("User found:", user); // 👈 log user lookup result

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    console.log("Login failed: invalid credentials"); // 👈 log failure reason
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;