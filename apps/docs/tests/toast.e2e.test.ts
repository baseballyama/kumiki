import { test, expect, type Page } from '@playwright/test';

const VIEWPORT = '[data-testid="viewport"]';
const ADD_INFO = '[data-testid="add-info"]';
const ADD_ERROR = '[data-testid="add-error"]';
const ADD_STICKY = '[data-testid="add-sticky"]';
const CLEAR = '[data-testid="clear"]';
const TOAST = '[data-testid="toast"]';
const COUNT = '[data-testid="count"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${VIEWPORT}[id^="kumiki-toast-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Toast', () => {
  test('viewport has role=region with polite live-region attributes', async ({ page }) => {
    await page.goto('/sandbox/toast');
    await waitForHydration(page);
    const v = page.locator(VIEWPORT);
    await expect(v).toHaveAttribute('role', 'region');
    await expect(v).toHaveAttribute('aria-live', 'polite');
    await expect(v).toHaveAttribute('aria-label', 'Notifications');
  });

  test('Add info pushes one toast (status, polite)', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=60000');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    await expect(page.locator(TOAST)).toHaveCount(1);
    await expect(page.locator(COUNT)).toHaveText('1');
    const item = page.locator(TOAST).first();
    await expect(item).toHaveAttribute('role', 'status');
    await expect(item).toHaveAttribute('aria-live', 'polite');
    await expect(item).toHaveAttribute('data-type', 'info');
  });

  test('Add error pushes a toast with role=alert + assertive', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=60000');
    await waitForHydration(page);
    await page.locator(ADD_ERROR).click();
    const item = page.locator(TOAST).first();
    await expect(item).toHaveAttribute('role', 'alert');
    await expect(item).toHaveAttribute('aria-live', 'assertive');
    await expect(item).toHaveAttribute('data-type', 'error');
  });

  test('auto-dismisses after duration', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=400');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    await expect(page.locator(TOAST)).toHaveCount(1);
    await expect(page.locator(TOAST)).toHaveCount(0, { timeout: 2000 });
  });

  test('hover pauses auto-dismiss', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=600');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    const item = page.locator(TOAST).first();
    await item.hover();
    // Wait long enough that without pause it would have dismissed.
    await page.waitForTimeout(1200);
    await expect(page.locator(TOAST)).toHaveCount(1);
  });

  test('sticky toast does not auto-dismiss', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=300');
    await waitForHydration(page);
    await page.locator(ADD_STICKY).click();
    await page.waitForTimeout(1000);
    await expect(page.locator(TOAST)).toHaveCount(1);
  });

  test('Close button dismisses the toast', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=60000');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    await expect(page.locator(TOAST)).toHaveCount(1);
    await page.locator('[data-testid="toast-close"]').click();
    await expect(page.locator(TOAST)).toHaveCount(0);
  });

  test('Clear empties the queue', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=60000');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    await page.locator(ADD_INFO).click();
    await page.locator(ADD_ERROR).click();
    await expect(page.locator(TOAST)).toHaveCount(3);
    await page.locator(CLEAR).click();
    await expect(page.locator(TOAST)).toHaveCount(0);
  });

  test('max trims the queue from the front', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=60000&max=2');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    await page.locator(ADD_INFO).click();
    await page.locator(ADD_INFO).click();
    await expect(page.locator(TOAST)).toHaveCount(2);
  });

  test('Title / Description are wired with stable ids', async ({ page }) => {
    await page.goto('/sandbox/toast?duration=60000');
    await waitForHydration(page);
    await page.locator(ADD_INFO).click();
    const titleId = await page.locator('[data-testid="toast-title"]').getAttribute('id');
    const descId = await page.locator('[data-testid="toast-description"]').getAttribute('id');
    expect(titleId).toBeTruthy();
    expect(descId).toBeTruthy();
    expect(titleId).not.toBe(descId);
  });
});
