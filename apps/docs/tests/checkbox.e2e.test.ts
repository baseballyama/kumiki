import { test, expect, type Page } from '@playwright/test';

const CHECKBOX = '[data-testid="checkbox-host"] > button';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${CHECKBOX}[id^="kumiki-checkbox-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Checkbox', () => {
  test('renders unchecked with role=checkbox', async ({ page }) => {
    await page.goto('/sandbox/checkbox');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('role', 'checkbox');
    await expect(btn).toHaveAttribute('aria-checked', 'false');
    await expect(btn).toHaveAttribute('data-state', 'unchecked');
  });

  test('renders checked when initial=checked', async ({ page }) => {
    await page.goto('/sandbox/checkbox?initial=checked');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await expect(btn).toHaveAttribute('aria-checked', 'true');
    await expect(btn).toHaveAttribute('data-state', 'checked');
  });

  test('renders mixed when initial=mixed', async ({ page }) => {
    await page.goto('/sandbox/checkbox?initial=mixed');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await expect(btn).toHaveAttribute('aria-checked', 'mixed');
    await expect(btn).toHaveAttribute('data-state', 'mixed');
  });

  test('click toggles unchecked → checked', async ({ page }) => {
    await page.goto('/sandbox/checkbox');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-checked', 'true');
  });

  test('click on mixed lands on checked (APG tristate)', async ({ page }) => {
    await page.goto('/sandbox/checkbox?initial=mixed');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-checked', 'true');
    await expect(btn).toHaveAttribute('data-state', 'checked');
  });

  test('Space toggles', async ({ page }) => {
    await page.goto('/sandbox/checkbox');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await btn.focus();
    await page.keyboard.press('Space');
    await expect(btn).toHaveAttribute('aria-checked', 'true');
  });

  test('disabled checkbox ignores clicks', async ({ page }) => {
    await page.goto('/sandbox/checkbox?disabled=1');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await expect(btn).toHaveAttribute('aria-disabled', 'true');
    await btn.click({ force: true });
    await expect(btn).toHaveAttribute('aria-checked', 'false');
  });

  test('externally setting mixed updates ARIA', async ({ page }) => {
    await page.goto('/sandbox/checkbox');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await page.getByTestId('ext-set-mixed').click();
    await expect(btn).toHaveAttribute('aria-checked', 'mixed');
  });

  test('onCheckedChange fires only on user interaction', async ({ page }) => {
    await page.goto('/sandbox/checkbox');
    await waitForHydration(page);
    const btn = page.locator(CHECKBOX);
    await btn.click();
    await expect(page.getByTestId('log')).toContainText('onCheckedChange(checked)');
    await page.getByTestId('ext-set-mixed').click();
    await expect(page.getByTestId('value')).toHaveText('mixed');
    const logItems = page.locator('[data-testid="log"] li');
    await expect(logItems).toHaveCount(1);
  });
});
