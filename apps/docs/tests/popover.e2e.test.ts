import { test, expect, type Page } from '@playwright/test';

const TRIGGER = '[data-testid="trigger"]';
const CONTENT = '[data-testid="content"]';
const CLOSE = '[data-testid="close"]';
const INPUT = '[data-testid="input"]';
const OUTSIDE = '[data-testid="outside-button"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${TRIGGER}[id^="kumiki-popover-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Popover', () => {
  test('renders trigger with proper ARIA when closed', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('clicking trigger opens, focus moves into content', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(CONTENT)).toBeVisible();
    await expect(page.locator(INPUT)).toBeFocused();
  });

  test('clicking trigger again closes (toggle)', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(CONTENT)).toBeVisible();
    await page.locator(TRIGGER).click();
    await expect(page.locator(CONTENT)).toBeHidden();
    await expect(page.locator(TRIGGER)).toBeFocused();
  });

  test('Close button closes and restores focus to trigger', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.locator(CLOSE).click();
    await expect(page.locator(CONTENT)).toBeHidden();
    await expect(page.locator(TRIGGER)).toBeFocused();
  });

  test('Escape closes when closeOnEscape (default true)', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('Escape');
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('Escape ignored when closeOnEscape=0', async ({ page }) => {
    await page.goto('/sandbox/popover?escape=0');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('Escape');
    await expect(page.locator(CONTENT)).toBeVisible();
  });

  test('outside click closes when closeOnOutsideClick (default true)', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.locator(OUTSIDE).click();
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('outside click ignored when closeOnOutsideClick=0', async ({ page }) => {
    await page.goto('/sandbox/popover?outside=0');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.locator(OUTSIDE).click();
    await expect(page.locator(CONTENT)).toBeVisible();
  });

  test('Tab moves focus out of popover (non-modal)', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(INPUT)).toBeFocused();
    // Non-modal: Tab eventually moves out of the popover content. Verify by
    // tabbing several times and ensuring focus leaves the input.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator(INPUT)).not.toBeFocused();
  });

  test('content has role=dialog with aria-labelledby + aria-describedby', async ({ page }) => {
    await page.goto('/sandbox/popover?initial=open');
    await waitForHydration(page);
    const content = page.locator(CONTENT);
    await expect(content).toHaveAttribute('role', 'dialog');
    const labelId = await content.getAttribute('aria-labelledby');
    const descId = await content.getAttribute('aria-describedby');
    expect(labelId).toBeTruthy();
    expect(descId).toBeTruthy();
    await expect(page.locator(`#${labelId}`)).toHaveText('Settings');
    await expect(page.locator(`#${descId}`)).toHaveText('Configure your preferences.');
  });

  test('externally toggling open mirrors state into the trigger ARIA', async ({ page }) => {
    await page.goto('/sandbox/popover');
    await waitForHydration(page);
    await page.getByTestId('ext-toggle').click();
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'true');
    await page.getByTestId('ext-toggle').click();
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'false');
  });
});
