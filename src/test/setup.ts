import '@testing-library/jest-dom'

// Add any global test setup here
// This file runs before each test file

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>()

  window.matchMedia = (query: string): MediaQueryList => {
    const match = query === '(prefers-color-scheme: dark)' ? false : false
    const key = query
    const getListeners = () => {
      if (!listeners.has(key)) {
        listeners.set(key, new Set())
      }
      return listeners.get(key) as Set<(event: MediaQueryListEvent) => void>
    }

    return {
      matches: match,
      media: query,
      onchange: null,
      addListener: listener => getListeners().add(listener),
      removeListener: listener => getListeners().delete(listener),
      addEventListener: (_event, listener) => getListeners().add(listener as (event: MediaQueryListEvent) => void),
      removeEventListener: (_event, listener) => getListeners().delete(listener as (event: MediaQueryListEvent) => void),
      dispatchEvent: () => true,
    }
  }
}
