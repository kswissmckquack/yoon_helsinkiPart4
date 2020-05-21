const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
        title: "Cleo--- patra",
        author: "Cleopatra",
        url: "www.google.com",
        likes: 5,
    },
    {
        title: "Frank",
        author: "Ocean",
        url: "1",
        likes: 4,
    },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
})

test('blogs returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
})

test('all blogs are returned', async() => {
  const res = await api.get('/api/blogs');

  expect(res.body).toHaveLength(initialBlogs.length);
})

test('unique identifier property is id', async() => {
  const res = await api.get('/api/blogs');
  expect(res.body.map(b => b.id)).toBeDefined();
})

test('new blog added', async() => {
  const newBlog = new Blog({
    title: "testing 123",
    author: "jorge or is it",
    url: "www.reddit.com",
    likes: 67,
  });
  const res = await newBlog.save();
  expect(res.title).toBe(newBlog.title);
})

test('likes default 0', async() => {
  const newBlog = new Blog({
    title: "this is a blog",
    author: "james",
    url: "www.stackoverflow.com"
  })

  expect(newBlog.likes).toBe(0)
})

test('if required fields missing 400 Bad Request', async() => {
  const newBlog = new Blog({
    author:"tester",
    likes:1
  })
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
