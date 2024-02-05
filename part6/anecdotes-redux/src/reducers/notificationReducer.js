import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotif(state, action) {
      return action.payload
    },
    removeNotif(state, action) {
      return null
    }
  }
})

export const { setNotif, removeNotif } = notificationSlice.actions

export const setNotification = (message, time) => {
  return dispatch => {
    dispatch(setNotif(message))
    setTimeout(() => {dispatch(removeNotif())}, time*1000)
  }
}

export default notificationSlice.reducer