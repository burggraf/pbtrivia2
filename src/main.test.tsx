import type { ReactElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { renderMock, createRootMock } = vi.hoisted(() => {
  const render = vi.fn()
  const createRoot = vi.fn(() => ({ render }))
  return { renderMock: render, createRootMock: createRoot }
})

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock
}))

const AppMock = () => <div data-testid="app-root">App</div>

vi.mock('./App.tsx', () => ({
  default: AppMock
}))

let AuthContextModule: typeof import('./contexts/AuthContext')
let ThemeContextModule: typeof import('./contexts/ThemeContext')

describe('main entry point', () => {
  beforeEach(async () => {
    vi.resetModules()
    renderMock.mockClear()
    createRootMock.mockClear()
    document.body.innerHTML = '<div id="root"></div>'
    AuthContextModule = await import('./contexts/AuthContext')
    ThemeContextModule = await import('./contexts/ThemeContext')
  })

  it('wraps App with AuthProvider', async () => {
    await import('./main.tsx')

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'))
    expect(renderMock).toHaveBeenCalledTimes(1)

    const tree = renderMock.mock.calls[0][0] as ReactElement
    expect(tree.props.children.type).toBe(ThemeContextModule.ThemeProvider)

    const authProvider = tree.props.children.props.children as ReactElement
    expect(authProvider.type).toBe(AuthContextModule.AuthProvider)

    const appTree = authProvider.props.children as ReactElement
    expect(appTree.type).toBe(AppMock)
  })
})
