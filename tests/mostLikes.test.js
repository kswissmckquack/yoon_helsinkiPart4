const mostLikes = require('../utils/mostLikes');

describe('most likes', () => {
  test('Multiple Blogs', () => {
    const blogs = [
      { author: 'james', likes: 4 },
      { author: 'james', likes: 10 },
      { author: 'james', likes: 11 },
      { author: 'jeff', likes: 4 },
      { author: 'Jamie', likes: 100 },
      { author: 'Gandalf', likes: 2 },
      { author: 'Patrick', likes: 88 },
      { author: 'El Hefe', likes: 4 },
      { author: 'Morganne', likes: 4 },
    ];
    const result = mostLikes.mostLikes(blogs);
    expect(result).toEqual({ author: 'Jamie', likes: 100 });
  });
  test('One Blog', () => {
    const blogs = [
      { author: 'james', likes: 4 },
    ];
    const result = mostLikes.mostLikes(blogs);
    expect(result).toEqual({ author: 'james', likes: 4 });
  });
  test('Empty Array', () => {
    const blogs = [];
    const result = mostLikes.mostLikes(blogs);
    expect(result).toBe(null);
  });
  test('Null Input', () => {
    const blogs = null;
    const result = mostLikes.mostLikes(blogs);
    expect(result).toBe(null);
  });
});
