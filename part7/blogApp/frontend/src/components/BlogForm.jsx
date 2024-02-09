import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setnewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
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

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm