import { test, expect } from '@playwright/test';

test('landing page renders', async ({ page }) => {
  await page.goto('/');
  // The heading is editorial / multiline; we just assert there's a visible h1
  // and the brand wordmark is reachable via the header.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /Kumiki — homepage/i })).toBeVisible();
});
