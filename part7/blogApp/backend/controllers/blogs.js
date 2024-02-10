const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, middleware.tokenExtractor , async (request, response) => {
  const blog = request.body
  const user = request.user

  if (!blog.title || !blog.author) {
    return response.status(400).json({
      error: 'title or author field cant be empty'
    })
  }

  const newBlog = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url || null,
    likes: blog.likes || 0,
    comments: [],
    user: user.id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const res = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(res)

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    { $set: body },
    { new: true, runValidators: true, context: 'query' })

  if (!updatedBlog) {
    return response.status(404).json({ message: 'Item not found' })
  } else {
    const res = await updatedBlog.populate('user', { username: 1, name: 1 })
    response.json(res)
  }
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = request.body.comment
  const updatedBlog = await Blog.findById(request.params.id)

  if (!updatedBlog) {
    return response.status(404).json({ message: 'Item not found' })
  } else {
    updatedBlog.comments = updatedBlog.comments.concat(comment)
    updatedBlog.save()
    const res = await updatedBlog.populate('user', { username: 1, name: 1 })
    response.json(res)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, middleware.tokenExtractor, async (request, response) => {
  const user = request.user
  const blogUser = await Blog.findById(request.params.id)

  if (user._id.toString() === blogUser.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Not Authorized' })
  }

})

module.exports = {
  blogsRouter
}