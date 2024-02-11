import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useMatch, Link, Navigate } from 'react-router-dom'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import SingleUser from './components/SingleUser'
import blogService from './services/blogs'
import { setUser } from './reducers/loggedUserReducer'
import { fetchBlogs } from './reducers/blogsReducer'
import { fetchUsers } from './reducers/usersReducer'
import './index.css'
import SingleBlog from './components/SingleBlog'



const App = () => {
  const user = useSelector(state => state.loggedUser)
  const blogs = useSelector(state => state.blogs)
  const userList = useSelector(state => state.users)
  const blogFormRef = useRef()
  const dispatch = useDispatch()
  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    dispatch(fetchBlogs())
    dispatch(fetchUsers())
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [])

  if (!blogs) return null
  if (!userList) return null

  const singleUser = userMatch
    ? userList.find(user => user.id === userMatch.params.id)
    : null
  const singleBlog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    dispatch(setUser(null))
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm />
    </Togglable>
  )

  const blogList = () => (
    <div id='blogList'>
      <h2 className='mb-2'>blogs</h2>
      <>{blogForm()}</>
      {blogs.map(blog =>
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>
      )}
    </div>
  )

  const padding = { padding: 5 }

  return (
    <div className='mx-24 '>

      <div className='bg-slate-400 p-2 '>

        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <>
            <i className='text-sm'>{user.name} logged in</i>
            <button onClick={handleLogout}>
            logout
            </button></>
          : <Link style={padding} to="/login">login</Link>
        }
      </div>


      {!user &&
      <Routes>
        <Route path="/*" element={<Navigate replace to="/login" /> } />
        <Route path='/login' element={<LoginForm />} />
      </Routes>
      }
      {user &&
      <div className='p-4 bg-slate-100'>
        <Notification />
        <Routes>
          <Route path='/' element ={<>{blogList()}</>}  />
          <Route path="/login" element={<Navigate replace to="/" /> } />
          <Route path='/blogs' element ={<>{blogList()}</>}  />
          <Route path='/users' element ={<Users/>}  />
          <Route path='/users/:id' element ={<SingleUser user={singleUser}/>}  />
          <Route path='/blogs/:id' element ={<SingleBlog blog={singleBlog}/>}  />
        </Routes>
      </div>
      }
    </div>
  )
}

export default App