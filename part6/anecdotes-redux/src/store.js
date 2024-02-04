import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
import { configureStore } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

const selectAnecdotes = store => store.anecdotes
const selectFilter = state => state.filter

export const selectAnecdoteList = createSelector([selectAnecdotes, selectFilter], (anecdotes,  filter) => {
  return anecdotes.filter((anecdote) => {
    const anec = anecdote.content.toLowerCase()
    const fil = filter.toLowerCase()
    return anec.includes(fil)
  })
})

export default store