import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = userSlice.actions

export const fetchUsers = () => {
  return async dispatch => {
    const blogs = await usersService.getAll()
    dispatch(setUsers(blogs))
  }
}

export default userSlice.reducer