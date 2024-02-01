import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import './index.css'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(( a, b ) => b.likes - a.likes)
      setBlogs( blogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // noteService.setToken(user.token)
    }
  }, [])

  if (!blogs) {
    return null
  }

  const addBlog = async (blogObject) => {
    blogService.setToken(user.token)

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage('blog added')
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    blogFormRef.current.toggleVisibility()
  }

  const handleLikeBlog = async (blogObject) => {
    blogService.setToken(user.token)

    try {
      const returnedBlog = await blogService.update(blogObject)
      const newBlogs = blogs.map(blog => blog.id !== blogObject.id? blog: returnedBlog)
      newBlogs.sort(( a, b ) => b.likes - a.likes)
      setBlogs(newBlogs)
      setNotificationMessage('blog liked')
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blogObject) => {
    blogService.setToken(user.token)

    if (window.confirm(`Remove blog ${blogObject.title} ${blogObject.author}`)) {
      try {
        await blogService.remove(blogObject)
        const newBlogs = blogs.filter(blog => blog.id !== blogObject.id)
        setBlogs(newBlogs)
        setNotificationMessage('blog deleted')
        setTimeout(() => {setNotificationMessage(null)}, 5000)
      } catch (error) {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }

  }

  const handleLogin = async (credentials) => {
    event.preventDefault()

    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setNotificationMessage('logged in')
      setTimeout(() => {setNotificationMessage(null)}, 5000)

    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    blogService.setToken(null)
    setUser(null)
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
    <>
      {blogs.map(blog =>
        <Blog key={blog.id} likeBlog={handleLikeBlog} deleteBlog={handleDelete} blog={blog} />
      )}
    </>
  )

  return (
    <div>

      <Notification errorMessage={errorMessage} notificationMessage={notificationMessage}/>

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