import { test, expect, type Page } from '@playwright/test';

const TRIGGER = '[data-testid="trigger"]';
const CONTENT = '[data-testid="content"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${TRIGGER}[id^="kumiki-tooltip-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Tooltip', () => {
  test('renders trigger with aria-describedby + content with role=tooltip hidden', async ({
    page,
  }) => {
    await page.goto('/sandbox/tooltip');
    await waitForHydration(page);
    const triggerId = await page.locator(TRIGGER).getAttribute('id');
    const contentId = await page.locator(CONTENT).getAttribute('id');
    expect(triggerId).toMatch(/^kumiki-tooltip-.+-trigger$/);
    expect(contentId).toMatch(/^kumiki-tooltip-.+-content$/);
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-describedby', contentId!);
    await expect(page.locator(CONTENT)).toHaveAttribute('role', 'tooltip');
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('focusing the trigger opens the tooltip', async ({ page }) => {
    await page.goto('/sandbox/tooltip');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await expect(page.locator(CONTENT)).toBeVisible();
    await expect(page.locator(CONTENT)).toHaveAttribute('data-state', 'open');
  });

  test('blurring the trigger closes the tooltip', async ({ page }) => {
    await page.goto('/sandbox/tooltip');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await expect(page.locator(CONTENT)).toBeVisible();
    await page.locator(TRIGGER).blur();
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('Escape closes a focused tooltip', async ({ page }) => {
    await page.goto('/sandbox/tooltip');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await expect(page.locator(CONTENT)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('externally toggling open prop works', async ({ page }) => {
    await page.goto('/sandbox/tooltip');
    await waitForHydration(page);
    await page.getByTestId('ext-toggle').click();
    await expect(page.locator(CONTENT)).toBeVisible();
    await page.getByTestId('ext-toggle').click();
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('initial=open renders the tooltip visible', async ({ page }) => {
    await page.goto('/sandbox/tooltip?initial=open');
    await waitForHydration(page);
    await expect(page.locator(CONTENT)).toBeVisible();
  });

  test('onOpenChange fires only on transitions', async ({ page }) => {
    await page.goto('/sandbox/tooltip');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await expect(page.locator(CONTENT)).toBeVisible();
    await page.locator(TRIGGER).blur();
    await expect(page.locator(CONTENT)).toBeHidden();
    await expect(page.getByTestId('log')).toContainText('onOpenChange(true)');
    await expect(page.getByTestId('log')).toContainText('onOpenChange(false)');
  });
});
