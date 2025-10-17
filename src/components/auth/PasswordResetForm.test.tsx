import { describe, beforeEach, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

const requestPasswordResetMock = vi.fn()
const registerMock = vi.fn()
const loginMock = vi.fn()
const logoutMock = vi.fn()

const useAuthMock = vi.fn(() => ({
  requestPasswordReset: requestPasswordResetMock,
  register: registerMock,
  login: loginMock,
  logout: logoutMock,
  user: null,
  isAuthenticated: false,
  isLoading: false
}))

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => useAuthMock()
}))

// eslint-disable-next-line import/order
import { PasswordResetForm } from './PasswordResetForm'

const renderPasswordResetForm = (
  props: Partial<ComponentProps<typeof PasswordResetForm>> = {}
) => render(<PasswordResetForm onNavigate={vi.fn()} {...props} />)

describe('PasswordResetForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthMock.mockReturnValue({
      requestPasswordReset: requestPasswordResetMock,
      register: registerMock,
      login: loginMock,
      logout: logoutMock,
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  })

  it('renders the email field and instructions', () => {
    renderPasswordResetForm()

    expect(screen.getByText(/reset your password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('validates required email and format', async () => {
    const user = userEvent.setup()
    renderPasswordResetForm()

    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument()
    expect(requestPasswordResetMock).not.toHaveBeenCalled()
  })

  it('submits password reset request', async () => {
    const user = userEvent.setup()
    requestPasswordResetMock.mockResolvedValueOnce(undefined)

    renderPasswordResetForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(requestPasswordResetMock).toHaveBeenCalledWith('user@example.com')
    })

    expect(
      screen.getByText(/if that email exists, you will receive reset instructions/i)
    ).toBeInTheDocument()
  })

  it('shows success message even if request fails', async () => {
    const user = userEvent.setup()
    requestPasswordResetMock.mockRejectedValueOnce(new Error('Unexpected error'))

    renderPasswordResetForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(
      await screen.findByText(/if that email exists, you will receive reset instructions/i)
    ).toBeInTheDocument()
    expect(requestPasswordResetMock).toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    let resolveReset: () => void
    const resetPromise = new Promise<void>(resolve => {
      resolveReset = resolve
    })
    requestPasswordResetMock.mockImplementationOnce(() => resetPromise)

    const user = userEvent.setup()
    renderPasswordResetForm()

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()

    resolveReset!()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeEnabled()
    })
  })

  it('navigates back to login', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()

    renderPasswordResetForm({ onNavigate: navigate })

    await user.click(screen.getByRole('button', { name: /back to sign in/i }))

    expect(navigate).toHaveBeenCalledWith('login')
  })
})
