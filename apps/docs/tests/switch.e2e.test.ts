import { test, expect, type Page } from '@playwright/test';

const SWITCH = '[data-testid="switch-host"] > button';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${SWITCH}[id^="kumiki-switch-"]`)).toBeAttached({ timeout: 5000 });
}

test.describe('Switch', () => {
  test('renders unchecked by default with role=switch', async ({ page }) => {
    await page.goto('/sandbox/switch');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('role', 'switch');
    await expect(btn).toHaveAttribute('aria-checked', 'false');
    await expect(btn).toHaveAttribute('data-state', 'off');
  });

  test('renders checked when initial=on', async ({ page }) => {
    await page.goto('/sandbox/switch?initial=on');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await expect(btn).toHaveAttribute('aria-checked', 'true');
    await expect(btn).toHaveAttribute('data-state', 'on');
  });

  test('click toggles aria-checked', async ({ page }) => {
    await page.goto('/sandbox/switch');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-checked', 'true');
    await expect(btn).toHaveAttribute('data-state', 'on');
  });

  test('Space toggles', async ({ page }) => {
    await page.goto('/sandbox/switch');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await btn.focus();
    await page.keyboard.press('Space');
    await expect(btn).toHaveAttribute('aria-checked', 'true');
  });

  test('disabled switch ignores clicks', async ({ page }) => {
    await page.goto('/sandbox/switch?disabled=1');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await expect(btn).toHaveAttribute('aria-disabled', 'true');
    await btn.click({ force: true });
    await expect(btn).toHaveAttribute('aria-checked', 'false');
  });

  test('onCheckedChange fires only on user interaction', async ({ page }) => {
    await page.goto('/sandbox/switch');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await btn.click();
    await expect(page.getByTestId('log')).toContainText('onCheckedChange(true)');
    await page.getByTestId('ext-set-false').click();
    await expect(page.getByTestId('checked')).toHaveText('false');
    const logItems = page.locator('[data-testid="log"] li');
    await expect(logItems).toHaveCount(1);
  });

  test('externally setting checked updates ARIA', async ({ page }) => {
    await page.goto('/sandbox/switch');
    await waitForHydration(page);
    const btn = page.locator(SWITCH);
    await page.getByTestId('ext-set-true').click();
    await expect(btn).toHaveAttribute('aria-checked', 'true');
  });
});
