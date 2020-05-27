const mostBlogs = (blogs) => {
  const authors = blogs.map(b => b.author);
  const uniqueAuthor = [...new Set(authors)];
  const authorTotalBlogs = uniqueAuthor.map(a => {
    let num = 0;
    blogs.map(b => {
      if (a === b.author) {
        num++;
      }
    })
    return { author:a, blogs: num}
  });
  const totalBlogs = authorTotalBlogs.map(b => b.blogs);
  const maxBlogs = Math.max.apply(null, totalBlogs);
  const maxIndex = totalBlogs.indexOf(maxBlogs);
  const mostBlogs = authorTotalBlogs[maxIndex]//will only get first max
  return mostBlogs
};

module.exports = {
  mostBlogs,
}
