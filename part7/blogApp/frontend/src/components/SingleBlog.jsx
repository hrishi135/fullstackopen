import { useState } from 'react'
import { deleteBlog, likeBlog } from '../reducers/blogsReducer'
import { setNotification, setError } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'

const SingleBlog = ({ blog }) => {
  const user = useSelector(state => state.loggedUser)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([])
  const dispatch = useDispatch()

  if (!blog) return null



  const handleLikeBlog = async (blogObject) => {
    blogService.setToken(user.token)

    try {
      const returnedBlog = await blogService.update(blogObject)
      dispatch(likeBlog(returnedBlog))
      dispatch(setNotification('blog liked', 5))
    } catch (error) {
      dispatch(setError(error.response.data.error, 5))
    }
  }

  const handleDelete = async (blogObject) => {
    blogService.setToken(user.token)

    if (window.confirm(`Remove blog ${blogObject.title} ${blogObject.author}`)) {
      try {
        await blogService.remove(blogObject)
        dispatch(deleteBlog(blogObject))
        dispatch(setNotification('blog deleted', 5))
      } catch (error) {
        dispatch(setError(error.response.data.error, 5))
      }
    }
  }

  const handleLikeClick = () => {
    handleLikeBlog({
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const handleDeleteClick = () => {
    handleDelete(blog)
  }

  const addCommentClick = (e) => {
    e.preventDefault()
    setComments(comments.concat(newComment))
    setNewComment('')
  }

  return (
    <>
      <h2>{blog.title}</h2>

      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>

      <div>
        likes {blog.likes}
        <button id='likeBtn' className='likeBtn' onClick={handleLikeClick}> like </button>
        { (user.username === blog.user.username) && <button onClick={handleDeleteClick} >Delete</button>}
      </div>

      <div>
        added by {blog.user.name}
      </div>

      <h2>Comments </h2>

      <form onSubmit={addCommentClick}>
        <input
          value={newComment}
          onChange={({ target }) => setNewComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {comments.map(comment =>
          <li key={comment}>
            {comment}
          </li>)}
      </ul>

    </>
  )
}

export default SingleBlog