import { test, expect, type Page } from '@playwright/test';

const ROOT = '[data-testid="slider-host"] [data-component-host="slider"]';
const THUMB = '[data-testid="thumb"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${ROOT}[id^="kumiki-slider-"]`)).toBeAttached({ timeout: 5000 });
}

test.describe('Slider', () => {
  test('renders thumb with proper ARIA value attributes', async ({ page }) => {
    await page.goto('/sandbox/slider');
    await waitForHydration(page);
    await expect(page.locator(THUMB)).toHaveAttribute('role', 'slider');
    await expect(page.locator(THUMB)).toHaveAttribute('aria-valuemin', '0');
    await expect(page.locator(THUMB)).toHaveAttribute('aria-valuemax', '100');
    await expect(page.locator(THUMB)).toHaveAttribute('aria-valuenow', '50');
    await expect(page.locator(THUMB)).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('horizontal LTR: ArrowRight increments, ArrowLeft decrements', async ({ page }) => {
    await page.goto('/sandbox/slider');
    await waitForHydration(page);
    await page.locator(THUMB).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('value')).toHaveText('51');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('value')).toHaveText('50');
  });

  test('horizontal RTL: arrows are inverted', async ({ page }) => {
    await page.goto('/sandbox/slider?dir=rtl');
    await waitForHydration(page);
    await page.locator(THUMB).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByTestId('value')).toHaveText('51');
  });

  test('vertical: ArrowUp increments, ArrowDown decrements', async ({ page }) => {
    await page.goto('/sandbox/slider?orientation=vertical');
    await waitForHydration(page);
    await page.locator(THUMB).focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByTestId('value')).toHaveText('51');
  });

  test('PageUp/Down step by 10 (default pageStep)', async ({ page }) => {
    await page.goto('/sandbox/slider');
    await waitForHydration(page);
    await page.locator(THUMB).focus();
    await page.keyboard.press('PageUp');
    await expect(page.getByTestId('value')).toHaveText('60');
    await page.keyboard.press('PageDown');
    await expect(page.getByTestId('value')).toHaveText('50');
  });

  test('Home / End jump to bounds', async ({ page }) => {
    await page.goto('/sandbox/slider');
    await waitForHydration(page);
    await page.locator(THUMB).focus();
    await page.keyboard.press('End');
    await expect(page.getByTestId('value')).toHaveText('100');
    await page.keyboard.press('Home');
    await expect(page.getByTestId('value')).toHaveText('0');
  });

  test('externally setting value updates aria-valuenow', async ({ page }) => {
    await page.goto('/sandbox/slider');
    await waitForHydration(page);
    await page.getByTestId('ext-100').click();
    await expect(page.locator(THUMB)).toHaveAttribute('aria-valuenow', '100');
  });

  test('disabled: keyboard ignored, aria-disabled set', async ({ page }) => {
    await page.goto('/sandbox/slider?disabled=1');
    await waitForHydration(page);
    await expect(page.locator(THUMB)).toHaveAttribute('aria-disabled', 'true');
    await page.locator(THUMB).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('value')).toHaveText('50');
  });
});
