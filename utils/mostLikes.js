const mostLikes = (blogs) => {
  if (blogs !== null && blogs.length !== 0) {
    const likes = blogs.map(b => b.likes);
    const maxLikes = Math.max.apply(null, likes);
    return blogs[likes.indexOf(maxLikes)];
  }
  return null;
};

module.exports = {
  mostLikes,
};
