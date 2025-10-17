import { test, expect } from '@playwright/test'

test.describe('Auth landing smoke tests', () => {
  test('shows pbTrivia branding and login form', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/pbTrivia/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('updates the hash when navigating to registration', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /create one/i }).click()
    await expect(page).toHaveURL(/#register$/)
  })
})
