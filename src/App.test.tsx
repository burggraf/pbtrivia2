import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Vite \+ React \+ shadcn\/ui/i })).toBeInTheDocument()
  })

  it('renders the counter button', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    expect(button).toBeInTheDocument()
  })

  it('increments counter when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)

    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('renders button variants', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Outline' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ghost' })).toBeInTheDocument()
  })

  it('buttons are keyboard accessible', () => {
    render(<App />)
    const buttons = screen.getAllByRole('button')

    // All buttons should be in the tab order
    buttons.forEach(button => {
      expect(button).not.toHaveAttribute('tabIndex', '-1')
    })
  })
})
