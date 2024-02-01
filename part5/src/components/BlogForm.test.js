import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const ipTitle = container.querySelector('.ipTitle')
  const ipAuthor = container.querySelector('.ipAuthor')
  const ipUrl = container.querySelector('.ipUrl')
  const sendButton = screen.getByText('create')

  await user.type(ipTitle, 'Test Title')
  await user.type(ipAuthor, 'Test Author')
  await user.type(ipUrl, 'testurl.xyz')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('testurl.xyz')
})