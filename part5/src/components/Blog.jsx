import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)
  const [toggle, setToggle] = useState('show')

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const handleShowClick = () => {
    toggleVisibility()
    setToggle(toggle === 'show' ? 'hide': 'show')
  }

  const handleLikeClick = () => {
    likeBlog({
      id: blog.id,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    })
  }

  const handleDeleteClick = () => {
    deleteBlog(blog)
  }

  return (
    <>
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={handleShowClick}>{toggle}</button>
        </div>
        <div className='togglableContent' style={showWhenVisible}>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>

          <div>
            likes {blog.likes}
            <button className='likeBtn' onClick={handleLikeClick}>like</button>
          </div>

          <div>
            {blog.user.name}
          </div>

          <button onClick={handleDeleteClick} style={{ marginLeft:0 }}>Delete</button>
        </div>
      </div>

    </>
  )
}

export default Blog