import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationReducer'
import blogsReducer from './blogsReducer'
import loggedUserReducer from './loggedUserReducer'
import usersReducer from './usersReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    loggedUser: loggedUserReducer,
    users: usersReducer
  }
})

export default store