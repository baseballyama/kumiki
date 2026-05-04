import { test, expect, type Page } from '@playwright/test';

const ROOT = '[data-testid="accordion-host"] [data-component-host="accordion"]';
const TRIGGER = (v: string) => `[data-testid="trigger-${v}"]`;
const PANEL = (v: string) => `[data-testid="panel-${v}"]`;

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${ROOT}[id^="kumiki-accordion-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Accordion', () => {
  test('renders headers + panels with correct ARIA when closed', async ({ page }) => {
    await page.goto('/sandbox/accordion');
    await waitForHydration(page);
    await expect(page.locator(TRIGGER('general'))).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(PANEL('general'))).toHaveAttribute('role', 'region');
    await expect(page.locator(PANEL('general'))).toBeHidden();
  });

  test('clicking trigger opens its panel', async ({ page }) => {
    await page.goto('/sandbox/accordion');
    await waitForHydration(page);
    await page.locator(TRIGGER('general')).click();
    await expect(page.locator(TRIGGER('general'))).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(PANEL('general'))).toBeVisible();
  });

  test('single mode: opening a different item closes the prior', async ({ page }) => {
    await page.goto('/sandbox/accordion');
    await waitForHydration(page);
    await page.locator(TRIGGER('general')).click();
    await page.locator(TRIGGER('team')).click();
    await expect(page.locator(PANEL('general'))).toBeHidden();
    await expect(page.locator(PANEL('team'))).toBeVisible();
  });

  test('multiple mode: any subset can be open', async ({ page }) => {
    await page.goto('/sandbox/accordion?mode=multiple');
    await waitForHydration(page);
    await page.locator(TRIGGER('general')).click();
    await page.locator(TRIGGER('team')).click();
    await expect(page.locator(PANEL('general'))).toBeVisible();
    await expect(page.locator(PANEL('team'))).toBeVisible();
  });

  test('disabled trigger click is ignored', async ({ page }) => {
    await page.goto('/sandbox/accordion');
    await waitForHydration(page);
    await page.locator(TRIGGER('billing')).click({ force: true });
    await expect(page.locator(PANEL('billing'))).toBeHidden();
  });

  test('ArrowDown moves focus to next enabled trigger (skip disabled)', async ({ page }) => {
    await page.goto('/sandbox/accordion');
    await waitForHydration(page);
    await page.locator(TRIGGER('general')).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator(TRIGGER('team'))).toBeFocused();
  });

  test('Home / End jump within triggers', async ({ page }) => {
    await page.goto('/sandbox/accordion');
    await waitForHydration(page);
    await page.locator(TRIGGER('general')).focus();
    await page.keyboard.press('End');
    await expect(page.locator(TRIGGER('security'))).toBeFocused();
    await page.keyboard.press('Home');
    await expect(page.locator(TRIGGER('general'))).toBeFocused();
  });

  test('collapsible=false: cannot close the only-open', async ({ page }) => {
    await page.goto('/sandbox/accordion?collapsible=0');
    await waitForHydration(page);
    await page.locator(TRIGGER('general')).click();
    await expect(page.locator(PANEL('general'))).toBeVisible();
    await page.locator(TRIGGER('general')).click();
    await expect(page.locator(PANEL('general'))).toBeVisible();
  });
});
