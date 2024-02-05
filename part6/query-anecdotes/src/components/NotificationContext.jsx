/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch(action.type) {
    case 'SET': 
      return action.payload.content
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notfiDispatch] = useReducer(notificationReducer, null)

    return (
      <NotificationContext.Provider value={[notification, notfiDispatch]} >
        {props.children}
      </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const counterAndDispatch = useContext(NotificationContext)
  return counterAndDispatch[1]
}

export const setNotification = (content) => {
  return {
    type: 'SET',
    payload: {
      content: content
    }
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR'
  }
}

export default NotificationContext