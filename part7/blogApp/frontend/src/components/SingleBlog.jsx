import { useState } from 'react'
import { deleteBlog, modifyBlog } from '../reducers/blogsReducer'
import { setNotification, setError } from '../reducers/notificationReducer'
import blogService from '../services/blogs'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteBlogFromUser } from '../reducers/usersReducer'

const SingleBlog = ({ blog }) => {
  const user = useSelector(state => state.loggedUser)
  const [newComment, setNewComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!blog) return null

  const handleLikeBlog = async (blogObject) => {
    blogService.setToken(user.token)

    try {
      const returnedBlog = await blogService.update(blogObject)
      dispatch(modifyBlog(returnedBlog))
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
        dispatch(deleteBlogFromUser(blogObject))
        dispatch(setNotification('blog deleted', 5))
        navigate('/')
      } catch (error) {
        dispatch(setError(error.response.data.error, 5))
      }
    }
  }

  const addCommentClick = async (e) => {
    e.preventDefault()

    try {
      const returnedBlog = await blogService.addComment({
        id: blog.id,
        comment: newComment
      })
      dispatch(modifyBlog(returnedBlog))
      dispatch(setNotification('comment added', 5))
    } catch (error) {
      dispatch(setError(error.response.data.error, 5))
    }

    setNewComment('')
  }

  const handleLikeClick = () => {
    handleLikeBlog({
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      comments: blog.comments,
      url: blog.url
    })
  }

  const handleDeleteClick = () => {
    handleDelete(blog)
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
        {blog.comments.map(comment =>
          <li key={comment}>
            {comment}
          </li>)}
      </ul>

    </>
  )
}

export default SingleBlog