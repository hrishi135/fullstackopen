import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      const blog = action.payload
      let toUpdateUser = state.find(user => user.id === blog.user.id)
      const newUsers = state.map(user => user.id !== toUpdateUser.id
        ? user
        : { ...toUpdateUser, blogs: toUpdateUser.blogs.concat(blog) })
      return newUsers
    },
    removeBlog(state, action) {
      const blog = action.payload
      let toUpdateUser = state.find(user => user.id === blog.user.id)
      const newUsers = state.map(user => user.id !== toUpdateUser.id
        ? user
        : { ...toUpdateUser, blogs: toUpdateUser.blogs.filter(b => b.id !== blog.id) })
      return newUsers
    }
  }
})

export const { setUsers, addBlog, removeBlog } = userSlice.actions

export const fetchUsers = () => {
  return async dispatch => {
    const users = await usersService.getAll()
    dispatch(setUsers(users))
  }
}

export const addBlogToUser = (blog) => {
  return  dispatch => {
    dispatch(addBlog(blog))
  }
}

export const deleteBlogFromUser = (blog) => {
  return  dispatch => {
    dispatch(removeBlog(blog))
  }
}

export default userSlice.reducer