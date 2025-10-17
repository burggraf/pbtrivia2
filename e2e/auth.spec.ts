import { test, expect, type Route } from '@playwright/test'

const API_BASE = '**/api/collections/users'
const AUTH_ENDPOINT = `${API_BASE}/auth-with-password`
const RESET_ENDPOINT = `${API_BASE}/request-password-reset`

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS'
}

const jsonHeaders = {
  ...corsHeaders,
  'content-type': 'application/json'
}

const fulfillJson = (route: Route, data: unknown, status = 200) =>
  route.fulfill({ status, headers: jsonHeaders, body: JSON.stringify(data) })

const fulfillEmpty = (route: Route, status = 204) =>
  route.fulfill({ status, headers: corsHeaders, body: '' })

const defaultUser = {
  id: 'user_123',
  email: 'host@example.com',
  collectionName: 'users'
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.route('**/api/**', async route => {
    if (route.request().method() === 'OPTIONS') {
      await fulfillEmpty(route)
      return
    }

    await route.continue()
  })
})

test.describe('Authentication flows', () => {
  test('allows a new user to register and reach the dashboard', async ({ page }) => {
    await page.route(API_BASE, async route => {
      const body = JSON.parse(route.request().postData() ?? '{}')
      await fulfillJson(route, {
        id: 'user_new',
        email: body.email,
        collectionName: 'users'
      })
      await page.unroute(API_BASE)
    })

    await page.route(AUTH_ENDPOINT, async route => {
      const body = JSON.parse(route.request().postData() ?? '{}')
      await fulfillJson(route, {
        token: 'new-user-token',
        record: { id: 'user_new', email: body.identity, collectionName: 'users' }
      })
      await page.unroute(AUTH_ENDPOINT)
    })

    await page.goto('/')
    await page.getByRole('button', { name: /create one/i }).click()
    await page.getByLabel('Email').fill('newuser@example.com')
    await page.getByLabel('Display name').fill('Trivia Host')
    await page.getByLabel(/^Password$/).fill('password123')
    await page.getByLabel(/Confirm password/i).fill('password123')
    await page.getByRole('button', { name: /create account/i }).click()

    await expect(page.getByText(/welcome to pbtrivia/i)).toBeVisible()
  })

  test('allows an existing user to log in', async ({ page }) => {
    await page.route(AUTH_ENDPOINT, async route => {
      const body = JSON.parse(route.request().postData() ?? '{}')
      await fulfillJson(route, {
        token: 'valid-token',
        record: { ...defaultUser, email: body.identity }
      })
      await page.unroute(AUTH_ENDPOINT)
    })

    await page.goto('/')
    await page.getByLabel('Email').fill('host@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/welcome to pbtrivia/i)).toBeVisible()
    await expect(page.getByText(/host@example.com/i)).toBeVisible()
  })

  test('logs out and returns to the auth landing page', async ({ page }) => {
    await page.route(AUTH_ENDPOINT, async route => {
      await fulfillJson(route, { token: 'valid-token', record: defaultUser })
      await page.unroute(AUTH_ENDPOINT)
    })

    await page.goto('/')
    await page.getByLabel('Email').fill('host@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/welcome to pbtrivia/i)).toBeVisible()

    await page.getByRole('button', { name: /sign out/i }).click()

    await expect(page.getByText(/welcome to pbtrivia/i)).not.toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('sends a password recovery request', async ({ page }) => {
    await page.route(RESET_ENDPOINT, async route => {
      await fulfillEmpty(route)
      await page.unroute(RESET_ENDPOINT)
    })

    await page.goto('/')
    await page.getByRole('button', { name: /forgot password/i }).click()
    await page.getByLabel('Email').fill('forgot@example.com')
    await page.getByRole('button', { name: /send reset link/i }).click()

    await expect(
      page.getByText(/if that email exists, you will receive reset instructions/i)
    ).toBeVisible()
  })

  test('prevents submission when validation fails', async ({ page }) => {
    let requestCount = 0
    await page.route(AUTH_ENDPOINT, async route => {
      requestCount += 1
      await fulfillJson(route, { token: 'should-not-happen', record: defaultUser })
      await page.unroute(AUTH_ENDPOINT)
    })

    await page.goto('/')
    await page.getByRole('button', { name: /create one/i }).click()
    await page.getByRole('button', { name: /create account/i }).click()

    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/display name is required/i)).toBeVisible()
    await expect(requestCount).toBe(0)
  })

  test('persists the session after reloading the page', async ({ page }) => {
    await page.route(AUTH_ENDPOINT, async route => {
      await fulfillJson(route, { token: 'valid-token', record: defaultUser })
      await page.unroute(AUTH_ENDPOINT)
    })

    await page.goto('/')
    await page.getByLabel('Email').fill('host@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByText(/welcome to pbtrivia/i)).toBeVisible()

    await page.reload()

    await expect(page.getByText(/welcome to pbtrivia/i)).toBeVisible()
    await expect(page.getByText(/host@example.com/i)).toBeVisible()
  })

  test('allows navigation between auth forms', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /create one/i }).click()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()

    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    await page.getByRole('button', { name: /forgot password/i }).click()
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible()
  })
})
