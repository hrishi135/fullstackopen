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
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
        author:
          <input
            value={newAuthor}
            onChange={({ target }) => setnewAuthor(target.value)}
          />
        </div>
        <div>
        url:
          <input
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>

      </form>
    </>
  )
}

BlogForm.PropTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm