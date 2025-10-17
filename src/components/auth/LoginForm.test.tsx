import { describe, beforeEach, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

const loginMock = vi.fn()
const requestPasswordResetMock = vi.fn()
const registerMock = vi.fn()
const logoutMock = vi.fn()

const useAuthMock = vi.fn(() => ({
  login: loginMock,
  register: registerMock,
  requestPasswordReset: requestPasswordResetMock,
  logout: logoutMock,
  user: null,
  isAuthenticated: false,
  isLoading: false
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => useAuthMock()
}))

// The component import must come after the mocks
// eslint-disable-next-line import/order
import { LoginForm } from './LoginForm'

const renderLoginForm = (props: Partial<ComponentProps<typeof LoginForm>> = {}) =>
  render(<LoginForm onNavigate={vi.fn()} {...props} />)

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthMock.mockReturnValue({
      login: loginMock,
      register: registerMock,
      requestPasswordReset: requestPasswordResetMock,
      logout: logoutMock,
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  })

  it('renders email and password fields', () => {
    renderLoginForm()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it('calls login with provided credentials', async () => {
    const user = userEvent.setup()
    loginMock.mockResolvedValueOnce(undefined)

    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      })
    })
  })

  it('displays an error message when login fails', async () => {
    const user = userEvent.setup()
    loginMock.mockRejectedValueOnce(new Error('Invalid email or password'))

    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveValue('user@example.com')
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toHaveValue('')
  })

  it('shows loading state while submitting', async () => {
    let resolveLogin: () => void
    const loginPromise = new Promise<void>(resolve => {
      resolveLogin = resolve
    })
    loginMock.mockImplementationOnce(() => loginPromise)

    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()

    resolveLogin!()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled()
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' })
    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: /show password/i }))
    expect(passwordInput).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: /hide password/i }))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
