import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const mockHandler = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Test Title',
      author: 'Test Author',
      url: 'testurl.xyz',
      likes: 0,
      user: { name: 'userName' }
    }
    container = render(<Blog blog={blog} likeBlog={mockHandler} />).container
  })

  test('renders blog title and author by default', () => {
    const element = screen.getByText('Test Title Test Author')
    expect(element).toBeDefined()
    expect(element).not.toHaveStyle('display: none')
  })

  test('dosen`t render blog url, likes and user by default', () => {
    const element = container.querySelector('.togglableContent')
    expect(element).toBeDefined()
    expect(element).toHaveStyle('display: none')
  })

  test('after clicking the button - url, likes and user are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the likeButton event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.likeBtn')
    await user.click(button)
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  //   test('renders its children', async () => {
  //     await screen.findAllByText('togglable content')
  //   })

  //   test('at start the children are not displayed', () => {
  //     const div = container.querySelector('.togglableContent')
  //     expect(div).toHaveStyle('display: none')
  //   })

})


