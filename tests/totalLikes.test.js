const totalLikes = require('../utils/totalLikes');

describe('total likes', () => {
  test('Multiple Blogs', () => {
    const blogs = [
      { likes: 1 },
      { likes: 2 },
      { likes: 14 },
      { likes: 5 },
    ];
    const result = totalLikes.totalLikes(blogs);
    expect(result).toBe(22);
  });

  test('no blogs', () => {
    const blogs = [];
    const result = totalLikes.totalLikes(blogs);
    expect(result).toBe(0);
  });

  test('one blog', () => {
    const blogs = [
      { likes: 1 },
    ];
    const result = totalLikes.totalLikes(blogs);
    expect(result).toBe(1);
  });
});
