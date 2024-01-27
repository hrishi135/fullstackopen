const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listWithManyBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects
    .map(blog => blog.save())

  await Promise.all(promiseArray)

}, 100000)

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await helper.blogsInDb()
    expect(response).toHaveLength(helper.listWithManyBlogs.length)
  })

  test('blogs contain id property', async () => {
    const response = await helper.blogsInDb()
    expect(response[0].id).toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('success with a valid id', async () => {
    const response = await helper.blogsInDb()
    await api.get(`/api/blogs/${response[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    await api.get('/api/blogs/65b2156d2dc9296f3a069af3').expect(404)
  })

  test('fails with statuscode 404 if id is invalid', async () => {
    await api.get('/api/blogs/65b2156d2dc').expect(400)
  })

})

describe('addition of a single blog', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test Title 1',
      author: 'Test Author 1',
      url: 'testurl1.xyz',
      likes: 5,
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    const contents = response.map(r => r.title)
    expect(response).toHaveLength(helper.listWithManyBlogs.length + 1)
    expect(contents).toContain('Test Title 1')
  })

  test('defaults to zero if the likes property is missing', async () => {
    const newBlog = {
      title: 'Test Title 2',
      author: 'Test Author 2',
      url: 'testurl2.xyz',
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    const blog = response.filter(r => r.title === 'Test Title 2')
    const like = blog.map(b => b.likes)
    expect(like[0]).toBe(0)
  })

  test('fails with statuscode 400 if data is invalid', async () => {
    const newBlog = {
      url: 'testurl2.xyz',
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('update a blog', () => {

  test('update a single blog with valid id', async () => {
    const before = await helper.blogsInDb()
    const UpdatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'updatedurl.xyz',
      likes: before[0].likes + 1
    }
    await api.put(`/api/blogs/${before[0].id}`).send(UpdatedBlog)
    const after = await api.get(`/api/blogs/${before[0].id}`)
    const diff = after.body.likes - before[0].likes
    expect(diff).toBe(1)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const UpdatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'updatedurl.xyz',
      likes: 1
    }
    await api.put('/api/blogs/85b2156d2dc9296f3a069af3').send(UpdatedBlog).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const UpdatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'updatedurl.xyz',
      likes: 1
    }
    await api.put('/api/blogs/85b2156d2dc9296f').send(UpdatedBlog).expect(400)

  })
})

describe('deletion of a single blog', () => {
  test('delete a single blog', async () => {
    const before = await helper.blogsInDb()
    await api.delete(`/api/blogs/${before[0].id}`)
      .expect(204)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})