import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { verifyToken, verifySuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Convert a title into a URL-safe slug
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Ensure the slug is unique by appending a numeric suffix if needed
const generateUniqueSlug = async (title, excludeId = null) => {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await BlogPost.findOne(query);
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
};

// GET /blog - Public list of published posts, paginated, optional category filter
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const filter = { status: 'published' };
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const posts = await BlogPost.find(filter)
    .select('-content')
    .populate('author', 'fullName')
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await BlogPost.countDocuments(filter);

  res.json({
    success: true,
    message: 'Blog posts retrieved',
    data: {
      items: posts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// GET /blog/admin/all - Admin list of all posts including drafts
router.get('/admin/all', verifyToken, verifySuperAdmin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const posts = await BlogPost.find()
    .select('-content')
    .populate('author', 'fullName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await BlogPost.countDocuments();

  res.json({
    success: true,
    message: 'Blog posts retrieved',
    data: {
      items: posts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// GET /blog/slug/:slug - Public single published post
router.get('/slug/:slug', async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug, status: 'published' }).populate(
    'author',
    'fullName'
  );

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.json({ success: true, message: 'Blog post retrieved', data: post });
});

// POST /blog - Create a post (super admin only)
router.post('/', verifyToken, verifySuperAdmin, async (req, res) => {
  const { title, excerpt, content, featuredImage, category, tags, status } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'title and content are required' });
  }

  const slug = await generateUniqueSlug(title);
  const isPublished = status === 'published';

  const post = new BlogPost({
    title,
    slug,
    excerpt: excerpt || '',
    content,
    featuredImage: featuredImage || '',
    category: category || '',
    tags: Array.isArray(tags) ? tags : [],
    status: isPublished ? 'published' : 'draft',
    author: req.user.userId,
    publishedAt: isPublished ? new Date() : null,
  });

  await post.save();

  res.status(201).json({ success: true, message: 'Blog post created', data: post });
});

// GET /blog/:id - Admin single post by id (for editing)
router.get('/:id', verifyToken, verifySuperAdmin, async (req, res) => {
  const post = await BlogPost.findById(req.params.id).populate('author', 'fullName');

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.json({ success: true, message: 'Blog post retrieved', data: post });
});

// PUT /blog/:id - Update a post (super admin only)
router.put('/:id', verifyToken, verifySuperAdmin, async (req, res) => {
  const { title, excerpt, content, featuredImage, category, tags, status } = req.body;

  const post = await BlogPost.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  if (title && title !== post.title) {
    post.slug = await generateUniqueSlug(title, post._id);
    post.title = title;
  }
  if (excerpt !== undefined) post.excerpt = excerpt;
  if (content !== undefined) post.content = content;
  if (featuredImage !== undefined) post.featuredImage = featuredImage;
  if (category !== undefined) post.category = category;
  if (tags !== undefined) post.tags = Array.isArray(tags) ? tags : [];

  if (status && status !== post.status) {
    post.status = status;
    if (status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date();
    }
  }

  await post.save();

  res.json({ success: true, message: 'Blog post updated', data: post });
});

// DELETE /blog/:id - Delete a post (super admin only)
router.delete('/:id', verifyToken, verifySuperAdmin, async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  res.json({ success: true, message: 'Blog post deleted' });
});

export default router;
