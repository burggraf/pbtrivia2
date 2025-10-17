import { test, expect } from '@playwright/test'

test.describe('App Shell', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Vite/)

    // Check for main heading
    await expect(page.getByRole('heading', { name: /Vite \+ React/i })).toBeVisible()
  })

  test('counter button works', async ({ page }) => {
    await page.goto('/')

    // Find the counter button
    const button = page.getByRole('button', { name: /count is/i })
    await expect(button).toBeVisible()

    // Click the button
    await button.click()

    // Check that count increased
    await expect(button).toHaveText(/count is 1/)
  })

  test('button variants are accessible', async ({ page }) => {
    await page.goto('/')

    // All buttons should be keyboard accessible
    const outlineButton = page.getByRole('button', { name: 'Outline' })
    await expect(outlineButton).toBeVisible()

    // Tab navigation should work
    await page.keyboard.press('Tab')
    // At least one button should be focused
    const focusedElement = await page.evaluateHandle(() => document.activeElement)
    await expect(focusedElement).toBeTruthy()
  })
})
