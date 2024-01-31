import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setnewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // noteService.setToken(user.token)
    }
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    const noteObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    
    blogService.setToken(user.token)
    
    try {
      const returnedBlog = await blogService.create(noteObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewTitle('')
      setnewAuthor('')
      setNewUrl('')
      setNotificationMessage('note added')
      setTimeout(() => {setNotificationMessage(null)}, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      }) 

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
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

  const loginForm = () => (
    <>
    <h2>login to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>     
    </> 
  )

  const blogForm = () => (
    <>
    <h2>create new</h2>
    <form onSubmit={addBlog}>
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
      <button type="submit">save</button>

    </form>  
    </>
  )

  const blogList = () => (
    <>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
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