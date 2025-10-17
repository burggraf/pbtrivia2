import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of RTL's render in tests
 *
 * @example
 * import { render, screen } from '@/test/utils'
 * render(<MyComponent />)
 * expect(screen.getByText('Hello')).toBeInTheDocument()
 */
function AllProviders({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }
