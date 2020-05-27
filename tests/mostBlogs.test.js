const mostBlogs = require('../utils/mostBlogs');

describe('most blogs', () => {
  test('multiple blogs', () => {
    const blogs = [
      { author: 'james' },
      { author: 'james' },
      { author: 'james' },
      { author: 'alphabet' },
      { author: 'gym' },
      { author: 'jones' },
      { author: 'julio' },
      { author: 'lilly' },
    ];
    const result = mostBlogs.mostBlogs(blogs);
    expect(result).toEqual({ author: 'james', blogs: 3 });//use toEqual for objects
  });
});
