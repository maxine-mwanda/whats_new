// server/routes/auth.js
const express = require('express');
const router = express.Router();

// Example route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Dummy login logic (replace with real auth)
  if (username === 'admin' && password === 'password') {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
