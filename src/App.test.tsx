import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import App from './App'

const useAuthMock = vi.fn()
const authLandingSpy = vi.fn(() => <div data-testid="auth-landing">Auth Landing</div>)

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => useAuthMock()
}))

vi.mock('@/components/auth/AuthLanding', () => ({
  AuthLanding: () => authLandingSpy()
}))

describe('App', () => {
  beforeEach(() => {
    useAuthMock.mockReset()
    authLandingSpy.mockClear()
  })

  const baseAuthState = {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    requestPasswordReset: vi.fn(),
    user: null
  }

  it('renders auth landing when the user is not authenticated', () => {
    useAuthMock.mockReturnValue({
      ...baseAuthState,
      isAuthenticated: false,
      isLoading: false
    })

    render(<App />)

    expect(screen.getByTestId('auth-landing')).toBeInTheDocument()
  })

  it('shows a loading indicator while auth state initializes', () => {
    useAuthMock.mockReturnValue({
      ...baseAuthState,
      isAuthenticated: false,
      isLoading: true
    })

    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent(/checking your account/i)
    expect(authLandingSpy).not.toHaveBeenCalled()
  })

  it('renders the main application when authenticated', () => {
    useAuthMock.mockReturnValue({
      ...baseAuthState,
      isAuthenticated: true,
      isLoading: false,
      user: { id: '123', email: 'host@example.com', collectionName: 'users' }
    })

    render(<App />)

    expect(screen.getByText(/welcome to pbtrivia/i)).toBeInTheDocument()
    expect(screen.getByText(/host@example.com/i)).toBeInTheDocument()
  })

  it('allows the user to logout', async () => {
    const logoutSpy = vi.fn()
    useAuthMock.mockReturnValue({
      ...baseAuthState,
      logout: logoutSpy,
      isAuthenticated: true,
      isLoading: false,
      user: { id: '123', email: 'host@example.com', collectionName: 'users' }
    })

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /sign out/i }))

    expect(logoutSpy).toHaveBeenCalledTimes(1)
  })
})
