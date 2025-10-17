import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of RTL's render in tests
 *
 * @example
 * import { render, screen } from '@/test/utils'
 * render(<MyComponent />)
 * expect(screen.getByText('Hello')).toBeInTheDocument()
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }
