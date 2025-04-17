const express = require('express');
const router = express.Router();
let posts = require('../data/posts');

// Dummy auth middleware (optional, replace with your real one if needed)
const auth = (req, res, next) => {
  // Skip auth for now or mock user
  req.user = { id: 1 }; 
  next();
};

// GET all posts
router.get('/', auth, (req, res) => {
  res.json(posts);
});

// GET one post
router.get('/:id', auth, (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// POST create a post
router.post('/', auth, (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title,
    content,
    userId: req.user.id,
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// DELETE a post
router.delete('/:id', auth, (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.json({ message: 'Post deleted' });
});

module.exports = router;
