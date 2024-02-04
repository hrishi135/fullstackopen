import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'

const AnendoteForm = () => {
  const dispatch = useDispatch()
  const add = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(addAnecdote(content))
    dispatch(setNotification(`you added '${content}'`))
    setTimeout(() => {dispatch(removeNotification())}, 5000)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={add}>
        <div><input name='content' /></div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnendoteForm