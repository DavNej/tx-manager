import { expect, test } from '@playwright/test'

test('should navigate to the home page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await expect(page).toHaveTitle(/Tx Manager/)
  await expect(page.locator('h1')).toContainText('Tx Manager')
  await expect(page.locator('p')).toContainText(
    'Send, schedule and view your transactions'
  )
})

test('should navigate to the /new page', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.click('text=New')
  await expect(page).toHaveURL('http://localhost:3000/new')
  await expect(page.locator('h1')).toContainText('Tx Manager')
  await expect(page.locator('h3')).toContainText('New transaction')
})
