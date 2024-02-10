import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: null,
  reducers: {
    setBlogsList(state, action) {
      const blogs = action.payload
      blogs.sort(( a, b ) => b.likes - a.likes)
      return blogs
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const returnedBlog = action.payload
      const newBlogs = state.map(blog => blog.id !== returnedBlog.id? blog: returnedBlog)
      newBlogs.sort(( a, b ) => b.likes - a.likes)
      return newBlogs
    },
    removeBlog(state, action) {
      const id = action.payload.id
      const newBlogs = state.filter(blog => blog.id !== id)
      return newBlogs
    }
  }
})

export const { setBlogsList, addBlog, updateBlog, removeBlog } = blogsSlice.actions

export const fetchBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogsList(blogs))
  }
}

export const appendBlog = (newBlog) => {
  return dispatch => {
    dispatch(addBlog(newBlog))
  }
}

export const modifyBlog = (updatedBlog) => {
  return  dispatch => {
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (blog) => {
  return async dispatch => {
    dispatch(removeBlog(blog))
  }
}

export default blogsSlice.reducer