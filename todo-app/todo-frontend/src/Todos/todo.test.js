import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import List from './List'

test('renders content', () => {
  const todos = [{
    text: 'Learn about containers',
    done: false
  },
  {
    text: 'Increase the number of tools in my toolbelt',
    done: false
  }]

  render(<List todos={todos}/>)

  const element = screen.getByText('Learn about containers')
  expect(element).toBeDefined()
})