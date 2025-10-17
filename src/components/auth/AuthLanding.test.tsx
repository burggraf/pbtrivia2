import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'

const authMock = {
  login: vi.fn(),
  register: vi.fn(),
  requestPasswordReset: vi.fn(),
  logout: vi.fn(),
  user: null,
  isAuthenticated: false,
  isLoading: false
}

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => authMock
}))

import { AuthLanding } from './AuthLanding'

describe('AuthLanding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.location.hash = ''
  })

  it('renders login form by default', async () => {
    render(<AuthLanding />)

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    await waitFor(() => {
      expect(window.location.hash).toBe('#login')
    })
  })

  it('navigates to registration form when requested', async () => {
    const user = userEvent.setup()
    render(<AuthLanding />)

    await user.click(screen.getByRole('button', { name: /create one/i }))

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#register')
  })

  it('navigates to password recovery form', async () => {
    const user = userEvent.setup()
    render(<AuthLanding />)

    await user.click(screen.getByRole('button', { name: /forgot password/i }))

    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#recover')
  })

  it('renders view based on initial hash', () => {
    window.location.hash = '#register'
    render(<AuthLanding />)

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('responds to external hash changes', async () => {
    render(<AuthLanding />)

    await act(async () => {
      window.location.hash = '#recover'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
    })
  })
})
