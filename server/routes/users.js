// server/routes/users.js
const express = require('express');
const router = express.Router();

// Example: GET /api/users
router.get('/', (req, res) => {
  res.json([
    { id: 1, username: 'alice' },
    { id: 2, username: 'bob' },
  ]);
});

module.exports = router;
