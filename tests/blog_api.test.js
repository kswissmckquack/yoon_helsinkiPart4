const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);
const saltRounds = 10;
const password = 'password';
const testUser = {
  username: 'TestUser1',
  name: 'test',
};
const initialBlogs = [
  {
    title: 'Cleo--- patra',
    author: 'Cleopatra',
    url: 'www.google.com',
    likes: 5,
  },
  {
    title: 'Frank',
    author: 'Ocean',
    url: '1',
    likes: 4,
  },
];
let token; //these two need to be delcared before the test suite to be used
let userId;

describe('Blog testing suite', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    testUser.passwordHash = await bcrypt.hash(password, saltRounds);
    const userObject = new User(testUser);
    await userObject.save();
    // get Token
    const res = await api
      .post('/api/login')
      .send({
        username: testUser.username,
        password: password,
      })
    token = res.body.token;

    const userId = userObject._id;

    let blogObject = new Blog(initialBlogs[0]);
    blogObject.user = userId;
    await blogObject.save();

    blogObject = new Blog(initialBlogs[1]);
    blogObject.user = userId;
    await blogObject.save();
  });

  test('blogs returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const res = await
    api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body).toHaveLength(initialBlogs.length);
  });

  test('unique identifier property is id', async () => {
    const res = await
    api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.map(b => b.id)).toBeDefined();
  });

  test('new blog added', async () => {
    const newBlog = new Blog({
      title: 'testing 123',
      author: 'jorge or is it',
      url: 'www.reddit.com',
      likes: 67
    });
    const res = await
    api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog);
    expect(res.body.title).toBe(newBlog.title);
  });

  test('likes default 0', async () => {
    const newBlog = new Blog({
      title: 'this is a blog',
      author: 'james',
      url: 'www.stackoverflow.com',
    });

    expect(newBlog.likes).toBe(0);
  });

  test('if required fields missing 400 Bad Request', async () => {
    const newBlog = new Blog({
      author: 'tester',
      likes: 1,
    });
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
