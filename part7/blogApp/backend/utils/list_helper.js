// const logger = require('./loggers')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {return 0}
  return blogs.reduce((tot, blog) => tot + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {return ({ title: null, author: null, likes: 0 })}
  const favorite = blogs.reduce((max, blog) => blog.likes > max.likes? blog: max, { likes: -1 })
  return ({
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  })
}

const mostBlogs = (blogs) => {
  const authorCounts = {}
  for (const blog of blogs) {
    const author = blog.author
    authorCounts[author] = (authorCounts[author] || 0) + 1
  }

  // Find the author with the most blogs.
  let mostBlogs = 0
  let maxAuthor = null
  for (const author in authorCounts) {
    if (authorCounts[author] > mostBlogs) {
      mostBlogs = authorCounts[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: mostBlogs,
  }
}

const mostLikes = (blogs) => {
  const authorCounts = {}
  for (const blog of blogs) {
    const author = blog.author
    authorCounts[author] = (authorCounts[author] || 0) + blog.likes
  }

  // Find the author with the most likes.
  let mostLikes = 0
  let maxAuthor = null
  for (const author in authorCounts) {
    if (authorCounts[author] > mostLikes) {
      mostLikes = authorCounts[author]
      maxAuthor = author
    }
  }
  // Return the result.
  return {
    author: maxAuthor,
    likes: mostLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
