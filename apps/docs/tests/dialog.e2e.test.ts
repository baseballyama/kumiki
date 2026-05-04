import { test, expect, type Page } from '@playwright/test';

const TRIGGER = '[data-testid="trigger"]';
const CONTENT = '[data-testid="content"]';
const OVERLAY = '[data-testid="overlay"]';
const CLOSE = '[data-testid="close"]';
const BG = '[data-testid="bg-button"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${TRIGGER}[id^="kumiki-dialog-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Dialog', () => {
  test('renders trigger with proper ARIA when closed', async ({ page }) => {
    await page.goto('/sandbox/dialog');
    await waitForHydration(page);
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('clicking the trigger opens, focus traps, Close returns focus', async ({ page }) => {
    await page.goto('/sandbox/dialog');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(CONTENT)).toBeVisible();
    await expect(page.locator(CONTENT)).toHaveAttribute('aria-modal', 'true');

    // Focus moved into the content's first focusable (the input).
    await expect(page.locator('[data-testid="input"]')).toBeFocused();

    await page.locator(CLOSE).click();
    await expect(page.locator(CONTENT)).toBeHidden();
    await expect(page.locator(TRIGGER)).toBeFocused();
  });

  test('Escape closes when policy permits', async ({ page }) => {
    await page.goto('/sandbox/dialog');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('Escape');
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('Escape is a no-op when closeOnEscape is disabled', async ({ page }) => {
    await page.goto('/sandbox/dialog?escape=0');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('Escape');
    await expect(page.locator(CONTENT)).toBeVisible();
  });

  test('clicking the overlay closes the dialog', async ({ page }) => {
    await page.goto('/sandbox/dialog');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    // Click the overlay — its bounding box covers the viewport but the panel
    // sits on top, so we click in the corner.
    await page.locator(OVERLAY).click({ position: { x: 5, y: 5 } });
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('non-modal: no overlay, background remains interactive (no inert)', async ({ page }) => {
    await page.goto('/sandbox/dialog?modal=0');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(CONTENT)).toHaveAttribute('aria-modal', 'false');
    await expect(page.locator(OVERLAY)).toHaveCount(0);
    // Background button is still focusable.
    await page.locator(BG).focus();
    await expect(page.locator(BG)).toBeFocused();
  });

  test('externally toggling open prop reflects in DOM', async ({ page }) => {
    await page.goto('/sandbox/dialog');
    await waitForHydration(page);
    await page.getByTestId('ext-toggle').click();
    await expect(page.locator(CONTENT)).toBeVisible();
    // Overlay covers the page once open; force the second click since the
    // button below is now visually obstructed.
    await page.getByTestId('ext-toggle').click({ force: true });
    await expect(page.locator(CONTENT)).toBeHidden();
  });

  test('Tab cycle keeps focus inside the content', async ({ page }) => {
    await page.goto('/sandbox/dialog');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    // Tab a few times — focus should never escape the panel.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const focusedInPanel = await page.evaluate(() => {
      const panel = document.querySelector('[data-testid="content"]');
      return !!(panel && panel.contains(document.activeElement));
    });
    expect(focusedInPanel).toBe(true);
  });
});
