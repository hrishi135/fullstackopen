import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { setNotification, setError   } from './reducers/notificationReducer'
import { setUser } from './reducers/userReducer'
import { appendBlog, deleteBlog, fetchBlogs, likeBlog } from './reducers/blogsReducer'
import { useDispatch, useSelector } from 'react-redux'
import './index.css'

const App = () => {
  // const [blogs, setBlogs] = useState(null)
  // const [user, setUser] = useState(null)
  const user = useSelector(state => state.user)
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    // blogService.getAll().then(blogs => {
    //   blogs.sort(( a, b ) => b.likes - a.likes)
    //   setBlogs( blogs )
    // })

    dispatch(fetchBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [])

  if (!blogs) {
    return null
  }

  const addBlog = async (blogObject) => {
    blogService.setToken(user.token)

    try {
      const returnedBlog = await blogService.create(blogObject)
      // setBlogs(blogs.concat(returnedBlog))
      dispatch(appendBlog(returnedBlog))
      dispatch(setNotification('blog added', 5))
    } catch (error) {
      dispatch(setError(error.response.data.error, 5))
    }

    blogFormRef.current.toggleVisibility()
  }

  const handleLikeBlog = async (blogObject) => {
    blogService.setToken(user.token)

    try {
      const returnedBlog = await blogService.update(blogObject)
      // const newBlogs = blogs.map(blog => blog.id !== blogObject.id? blog: returnedBlog)
      // newBlogs.sort(( a, b ) => b.likes - a.likes)
      // setBlogs(newBlogs)
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
        // const newBlogs = blogs.filter(blog => blog.id !== blogObject.id)
        // setBlogs(newBlogs)
        dispatch(deleteBlog(blogObject))
        dispatch(setNotification('blog deleted', 5))
      } catch (error) {
        dispatch(setError(error.response.data.error, 5))
      }
    }

  }

  const handleLogin = async (credentials) => {
    event.preventDefault()

    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setNotification('logged in', 5))
    } catch (exception) {
      dispatch(setError('Wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    dispatch(setUser(null))
  }

  const loginForm = () => {
    return (
      <>
        <h2>Login</h2>
        <Togglable buttonLabel='login'>
          <LoginForm handleSubmit={handleLogin}/>
        </Togglable>
      </>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const blogList = () => (
    <div id='blogList'>
      {blogs.map(blog =>
        <Blog key={blog.id} username={user.username} likeBlog={handleLikeBlog} deleteBlog={handleDelete} blog={blog} />
      )}
    </div>
  )

  return (
    <div>

      <Notification />

      {!user && loginForm()}
      {user &&
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in
          <button onClick={handleLogout}>
            logout
          </button>
        </p>
        {blogForm()}
        {blogList()}
      </div>
      }

    </div>
  )
}

export default App