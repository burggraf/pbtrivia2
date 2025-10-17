import { describe, beforeEach, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

const registerMock = vi.fn()
const loginMock = vi.fn()
const requestPasswordResetMock = vi.fn()
const logoutMock = vi.fn()

const useAuthMock = vi.fn(() => ({
  register: registerMock,
  login: loginMock,
  requestPasswordReset: requestPasswordResetMock,
  logout: logoutMock,
  user: null,
  isAuthenticated: false,
  isLoading: false
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => useAuthMock()
}))

import { RegisterForm } from './RegisterForm'

const renderRegisterForm = (props: Partial<ComponentProps<typeof RegisterForm>> = {}) =>
  render(<RegisterForm onNavigate={vi.fn()} {...props} />)

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthMock.mockReturnValue({
      register: registerMock,
      login: loginMock,
      requestPasswordReset: requestPasswordResetMock,
      logout: logoutMock,
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  })

  it('renders all required fields', () => {
    renderRegisterForm()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i, { selector: 'input' })).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/display name is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    expect(await screen.findByText(/confirm password is required/i)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('validates email format and password confirmation', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/display name/i), 'Trivia Fan')
    await user.type(screen.getByLabelText(/^password$/i, { selector: 'input' }), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(await screen.findByText(/passwords must match/i)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it('submits registration data when valid', async () => {
    const user = userEvent.setup()
    registerMock.mockResolvedValueOnce(undefined)

    renderRegisterForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/display name/i), 'Trivia Master')
    await user.type(screen.getByLabelText(/^password$/i, { selector: 'input' }), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: 'user@example.com',
        displayName: 'Trivia Master',
        password: 'password123',
        passwordConfirm: 'password123'
      })
    })
  })

  it('displays form error when registration fails', async () => {
    const user = userEvent.setup()
    registerMock.mockRejectedValueOnce(new Error('An account with this email already exists'))

    renderRegisterForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/display name/i), 'Trivia Master')
    await user.type(screen.getByLabelText(/^password$/i, { selector: 'input' }), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(
      await screen.findByText(/an account with this email already exists/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toHaveValue('user@example.com')
    expect(screen.getByLabelText(/display name/i)).toHaveValue('Trivia Master')
    expect(screen.getByLabelText(/^password$/i, { selector: 'input' })).toHaveValue('')
    expect(screen.getByLabelText(/confirm password/i)).toHaveValue('')
  })

  it('shows loading state while submitting', async () => {
    let resolveRegister: () => void
    const registerPromise = new Promise<void>(resolve => {
      resolveRegister = resolve
    })
    registerMock.mockImplementationOnce(() => registerPromise)

    const user = userEvent.setup()
    renderRegisterForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/display name/i), 'Trivia Master')
    await user.type(screen.getByLabelText(/^password$/i, { selector: 'input' }), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()

    resolveRegister!()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeEnabled()
    })
  })

  it('navigates to login when clicking sign in link', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()

    renderRegisterForm({ onNavigate: navigate })

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(navigate).toHaveBeenCalledWith('login')
  })
})
