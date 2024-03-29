import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import { setNotification, setError } from '../reducers/notificationReducer'
import { setUser } from '../reducers/loggedUserReducer'
// import '../css/output.css'


const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem( 'loggedUser', JSON.stringify(user))
      dispatch(setUser(user))
      dispatch(setNotification('logged in', 5))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      dispatch(setError('Wrong username or password', 5))
    }
  }

  return (
    <div className='p-4 bg-slate-100'>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            className='ml-3'
            id='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            className='ml-3'
            id='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button className='px-2 my-2' id='login-button'>login</button>
      </form>
    </div>
  )
}

export default LoginForm