import { useState } from 'react'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { appendBlog } from '../reducers/blogsReducer'
import { setNotification, setError } from '../reducers/notificationReducer'
import { addBlogToUser } from '../reducers/usersReducer'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setnewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  let user = useSelector(state => state.loggedUser)
  const dispatch = useDispatch()

  const addBlog = async (blogObject) => {
    blogService.setToken(user.token)
    try {
      const returnedBlog = await blogService.create(blogObject)
      dispatch(appendBlog(returnedBlog))
      dispatch(addBlogToUser(returnedBlog))
      dispatch(setNotification('blog added', 5))
    } catch (error) {
      dispatch(setError(error.response.data.error, 5))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setnewAuthor('')
    setNewUrl('')
  }
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
        title:
          <input
            id='title-input'
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            className='ipTitle'
          />
        </div>
        <div>
        author:
          <input
            id='author-input'
            value={newAuthor}
            onChange={({ target }) => setnewAuthor(target.value)}
            className='ipAuthor'
          />
        </div>
        <div>
        url:
          <input
            id='url-input'
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            className='ipUrl'
          />
        </div>
        <button id='submit-button' type="submit">create</button>

      </form>
    </>
  )
}

export default BlogForm