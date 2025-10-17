import { ReactNode } from 'react'
import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'

type ListenerRecord = Record<string, unknown> | null

const {
  authListeners,
  mockAuthStore,
  mockAuthWithPassword,
  mockCreate,
  mockRequestPasswordReset,
  collectionSpy
} = vi.hoisted(() => {
  const listeners = new Set<(token: string, record: ListenerRecord) => void>()
  const authWithPassword = vi.fn()
  const create = vi.fn()
  const requestPasswordReset = vi.fn()
  const collectionMethods = {
    authWithPassword,
    create,
    requestPasswordReset
  }
  const collection = vi.fn(() => collectionMethods)

  const store = {
    token: '',
    record: null as ListenerRecord,
    isValid: false,
    save(token: string, record: ListenerRecord) {
      this.token = token
      this.record = record
      this.isValid = Boolean(token) && Boolean(record)
      listeners.forEach(listener => listener(token, record))
    },
    clear() {
      this.save('', null)
    },
    onChange(callback: (token: string, record: ListenerRecord) => void) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    }
  }

  return {
    authListeners: listeners,
    mockAuthStore: store,
    mockAuthWithPassword: authWithPassword,
    mockCreate: create,
    mockRequestPasswordReset: requestPasswordReset,
    collectionSpy: collection
  }
})

vi.mock('@/lib/pocketbase', () => ({
  pocketBase: {
    authStore: mockAuthStore,
    collection: collectionSpy
  }
}))

// The module under test must be imported after the mocks
import { AuthProvider, useAuth } from './AuthContext'

const TestConsumer = () => {
  const auth = useAuth()

  return (
    <div>
      <span data-testid="user-id">{auth.user ? auth.user.id : 'null'}</span>
      <span data-testid="is-authenticated">{auth.isAuthenticated ? 'true' : 'false'}</span>
      <span data-testid="is-loading">{auth.isLoading ? 'true' : 'false'}</span>
      <button
        type="button"
        onClick={() => auth.login({ email: 'user@example.com', password: 'secret123' })}
      >
        login
      </button>
      <button type="button" onClick={() => auth.logout()}>
        logout
      </button>
    </div>
  )
}

const renderWithProvider = (ui: ReactNode) => render(<AuthProvider>{ui}</AuthProvider>)

describe('AuthContext', () => {
  beforeEach(() => {
    mockAuthStore.clear()
    collectionSpy.mockClear()
    mockAuthWithPassword.mockReset()
    mockCreate.mockReset()
    mockRequestPasswordReset.mockReset()
  })

  afterEach(() => {
    authListeners.clear()
  })

  it('initializes with no user and unauthenticated state', () => {
    renderWithProvider(<TestConsumer />)

    expect(screen.getByTestId('user-id').textContent).toBe('null')
    expect(screen.getByTestId('is-authenticated').textContent).toBe('false')
    expect(screen.getByTestId('is-loading').textContent).toBe('false')
  })

  it('updates state after successful login', async () => {
    const user = userEvent.setup()
    mockAuthWithPassword.mockResolvedValue({
      token: 'test-token',
      record: { id: '123', collectionName: 'users', email: 'user@example.com' }
    })

    renderWithProvider(<TestConsumer />)

    await user.click(screen.getByRole('button', { name: 'login' }))

    await waitFor(() => {
      expect(screen.getByTestId('user-id').textContent).toBe('123')
      expect(screen.getByTestId('is-authenticated').textContent).toBe('true')
    })

    expect(collectionSpy).toHaveBeenCalledWith('users')
    expect(mockAuthWithPassword).toHaveBeenCalledWith('user@example.com', 'secret123')
  })

  it('clears state on logout', async () => {
    const user = userEvent.setup()
    renderWithProvider(<TestConsumer />)

    await act(async () => {
      mockAuthStore.save('test-token', { id: '123', collectionName: 'users' })
    })

    await waitFor(() => {
      expect(screen.getByTestId('is-authenticated').textContent).toBe('true')
    })

    await user.click(screen.getByRole('button', { name: 'logout' }))

    expect(screen.getByTestId('user-id').textContent).toBe('null')
    expect(screen.getByTestId('is-authenticated').textContent).toBe('false')
  })

  it('persists auth state across provider remounts', async () => {
    mockAuthStore.save('persisted-token', { id: '123', collectionName: 'users' })

    const { unmount } = renderWithProvider(<TestConsumer />)

    expect(screen.getByTestId('is-authenticated').textContent).toBe('true')

    unmount()

    renderWithProvider(<TestConsumer />)

    expect(screen.getByTestId('is-authenticated').textContent).toBe('true')
    expect(screen.getByTestId('user-id').textContent).toBe('123')
  })
})
