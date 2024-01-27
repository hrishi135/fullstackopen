const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog.find({})
  response.json(blog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const blog = request.body

  if (!blog.title || !blog.author) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const newBlog = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url || null,
    likes: blog.likes || 0
  })

  const result = await newBlog.save()
  response.status(201).json(result)

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    { $set: body },
    { new: true, runValidators: true, context: 'query' })

  if (!updatedBlog) {
    return response.status(404).json({ message: 'Item not found' })
  } else {
    response.json(updatedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = {
  blogsRouter
}