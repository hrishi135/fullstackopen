import { useSelector } from 'react-redux'

const Notification = () => {
  const errorMessage = useSelector(state => state.notification.error)
  const notificationMessage = useSelector(state => state.notification.message)

  if (errorMessage === null && notificationMessage === null) {
    return null
  }
  else if (errorMessage === null) {
    return (
      <div className='notification'>
        {notificationMessage}
      </div>
    )
  }

  return (
    <div className='error'>
      {errorMessage}
    </div>
  )
}

export default Notification