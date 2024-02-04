import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, removeNotification } from '../reducers/notificationReducer'
import { selectAnecdoteList } from '../store'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  // const anecdotes = useSelector(({ anecdotes, filter }) => {
  //   return anecdotes.filter((anecdote) => {
  //     const anec = anecdote.content.toLowerCase()
  //     const fil = filter.toLowerCase()
  //     return anec.includes(fil)
  //   })
  // })

  const anecdotes = useSelector(state => selectAnecdoteList(state))

  const vote = ({ id, content }) => {
    dispatch(voteAnecdote(id))
    dispatch(setNotification(`you voted '${content}'`))
    setTimeout(() => {dispatch(removeNotification())}, 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList