import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import { ThemeProvider, useTheme } from './ThemeContext'

const originalMatchMedia = window.matchMedia
const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage')

const createMatchMediaMock = (initiallyDark = false) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const mock: MediaQueryList = {
    matches: initiallyDark,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: listener => listeners.add(listener),
    removeListener: listener => listeners.delete(listener),
    addEventListener: (_event, listener) => listeners.add(listener as (event: MediaQueryListEvent) => void),
    removeEventListener: (_event, listener) => listeners.delete(listener as (event: MediaQueryListEvent) => void),
    dispatchEvent: event => {
      listeners.forEach(listener => listener(event as MediaQueryListEvent))
      return true
    },
  }

  const setMatches = (next: boolean) => {
    mock.matches = next
    const event = new Event('change') as MediaQueryListEvent
    Object.defineProperty(event, 'matches', { value: next })
    mock.dispatchEvent(event)
  }

  return { mock, setMatches }
}

const renderWithProvider = (ui: ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

const TestConsumer = () => {
  const { mode, theme, setMode, reset, storageAvailable, persistenceWarning } = useTheme()

  return (
    <div>
      <p data-testid="mode">{mode}</p>
      <p data-testid="theme">{theme}</p>
      <p data-testid="storage">{storageAvailable ? 'available' : 'missing'}</p>
      <p data-testid="warning">{persistenceWarning ?? ''}</p>
      <button type="button" onClick={() => setMode('dark')}>
        dark
      </button>
      <button type="button" onClick={() => setMode('light')}>
        light
      </button>
      <button type="button" onClick={() => setMode('system')}>
        system
      </button>
      <button type="button" onClick={() => reset()}>
        reset
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = ''
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia

    if (originalLocalStorageDescriptor) {
      Object.defineProperty(window, 'localStorage', originalLocalStorageDescriptor)
    }
  })

  it('defaults to system mode and applies the system preference', () => {
    const { mock } = createMatchMediaMock(false)
    window.matchMedia = vi.fn(() => mock)

    renderWithProvider(<TestConsumer />)

    expect(screen.getByTestId('mode').textContent).toBe('system')
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists preference changes and updates the document theme', async () => {
    const user = userEvent.setup()
    const { mock } = createMatchMediaMock(false)
    window.matchMedia = vi.fn(() => mock)

    renderWithProvider(<TestConsumer />)

    await user.click(screen.getByRole('button', { name: 'dark' }))

    expect(screen.getByTestId('mode').textContent).toBe('dark')
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('pbtrivia:theme')).toBe('dark')
  })

  it('responds to system changes when mode is system', () => {
    const { mock, setMatches } = createMatchMediaMock(false)
    window.matchMedia = vi.fn(() => mock)

    renderWithProvider(<TestConsumer />)

    expect(screen.getByTestId('theme').textContent).toBe('light')

    act(() => {
      setMatches(true)
    })

    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back to in-memory storage when localStorage is unavailable', async () => {
    const user = userEvent.setup()

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: vi.fn(() => {
          throw new Error('storage unavailable')
        }),
        setItem: vi.fn(() => {
          throw new Error('storage unavailable')
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
    })

    const { mock } = createMatchMediaMock(false)
    window.matchMedia = vi.fn(() => mock)

    renderWithProvider(<TestConsumer />)

    await user.click(screen.getByRole('button', { name: 'dark' }))

    expect(screen.getByTestId('storage').textContent).toBe('missing')
    expect(screen.getByTestId('warning').textContent).toMatch(/reset after this session/i)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
