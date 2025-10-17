import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const loadModule = async () => {
  return await import('./pocketbase')
}

describe('pocketbase client singleton', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('initializes the client with the default URL', async () => {
    const { pocketBase } = await loadModule()
    expect(pocketBase.baseUrl).toBe('http://127.0.0.1:8090')
  })

  it('uses VITE_POCKETBASE_URL when provided', async () => {
    vi.stubEnv('VITE_POCKETBASE_URL', 'https://example.com')
    const { pocketBase } = await loadModule()
    expect(pocketBase.baseUrl).toBe('https://example.com')
  })

  it('returns the same instance on repeated access', async () => {
    const { getPocketBaseClient } = await loadModule()
    const first = getPocketBaseClient()
    const second = getPocketBaseClient()
    expect(first).toBe(second)
  })
})
