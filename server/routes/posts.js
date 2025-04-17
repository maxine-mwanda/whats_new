const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { Post, User, Category, Tag } = require('../models');
const { Op } = require('sequelize');

// @route    GET api/posts
// @desc     Get all published posts
// @access   Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search } = req.query;
    const offset = (page - 1) * limit;

    let where = { status: 'published' };
    let include = [
      { model: User, attributes: ['id', 'username', 'avatar'] },
      { model: Category, attributes: ['id', 'name', 'slug'] }
    ];

    if (category) {
      include[1].where = { slug: category };
    }

    if (tag) {
      include.push({
        model: Tag,
        where: { slug: tag },
        attributes: [],
        through: { attributes: [] }
      });
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const posts = await Post.findAndCountAll({
      where,
      include,
      order: [['published_at', 'DESC']],
      offset,
      limit: parseInt(limit),
      distinct: true
    });

    res.json({
      total: posts.count,
      pages: Math.ceil(posts.count / limit),
      currentPage: parseInt(page),
      posts: posts.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/posts
// @desc     Create a post
// @access   Private (Admin/Author)
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content, excerpt, categoryId, tags, status, featuredImage } = req.body;

      const post = await Post.create({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content,
        excerpt: excerpt || content.substring(0, 160) + '...',
        featured_image: featuredImage,
        author_id: req.user.id,
        category_id: categoryId,
        status: status || 'draft',
        published_at: status === 'published' ? new Date() : null
      });

      if (tags && tags.length > 0) {
        const tagIds = await Tag.findAll({
          where: { id: tags },
          attributes: ['id']
        });
        await post.setTags(tagIds);
      }

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;