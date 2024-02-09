/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  error: null,
  message: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotif(state, action) {
      return action.payload
    },
    removeNotif(state, action) {
      return {
        error: null,
        message: null
      }
    }
  }
})

export const { setNotif, removeNotif } = notificationSlice.actions

export const setNotification = (message, time) => {
  return dispatch => {
    dispatch(setNotif({
      error: null,
      message:message
    }))
    setTimeout(() => {dispatch(removeNotif())}, time*1000)
  }
}

export const setError = (error, time) => {
  return dispatch => {
    dispatch(setNotif({
      error: error,
      message: null
    }))
    setTimeout(() => {dispatch(removeNotif())}, time*1000)
  }
}

export default notificationSlice.reducer