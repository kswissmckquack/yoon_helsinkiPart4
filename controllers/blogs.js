const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog
    .findById(req.params.id);
  if (blog) {
    res.json(blog.toJSON());
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const title = body.title;
  const url = body.url;
  const user = await User.findById(decodedToken.id);
  const userId = user._id;

  if (!title || !url) {
    return res.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userId,
  });

  const savedBlog = await blog.save();
  //user document also updated
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.json(savedBlog.toJSON());
});

blogsRouter.put('/:id', async (req, res, next) => {
  const body = req.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
  res.json(updatedBlog.toJSON());
});

blogsRouter.delete('/:id', async (req, res, next) => {
  //probably make a helper to not repeat this code everytime
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const userId = decodedToken.id;
  const user = await User.findById(userId);
  const blogToDelete = await Blog.findById(req.params.id);

  if (blogToDelete.user.toString() === userId.toString()) {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  }

  res.status(403).json({ error: 'Permission denied' });
});

module.exports = blogsRouter;
