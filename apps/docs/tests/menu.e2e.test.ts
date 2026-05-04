import { test, expect, type Page } from '@playwright/test';

const TRIGGER = '[data-testid="trigger"]';
const MENU = '[data-testid="menu"]';
const NEW_ITEM = '[data-testid="item-new"]';
const OPEN_ITEM = '[data-testid="item-open"]';
const SAVE_ITEM = '[data-testid="item-save"]';
const EXPORT_ITEM = '[data-testid="item-export"]';
const QUIT_ITEM = '[data-testid="item-quit"]';
const OUTSIDE = '[data-testid="outside-button"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${TRIGGER}[id^="kumiki-menu-"]`)).toBeAttached({ timeout: 5000 });
}

test.describe('Menu', () => {
  test('renders trigger with proper ARIA when closed', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-haspopup', 'menu');
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(MENU)).toBeHidden();
  });

  test('clicking trigger opens menu + highlights first item', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(MENU)).toBeVisible();
    await expect(page.locator(NEW_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('Enter on trigger opens menu', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(MENU)).toBeVisible();
    await expect(page.locator(NEW_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('ArrowUp on trigger opens with last item highlighted', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.locator(MENU)).toBeVisible();
    await expect(page.locator(QUIT_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('arrow navigation skips separators + disabled items', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click(); // open, highlight = new
    await page.keyboard.press('ArrowDown');
    await expect(page.locator(OPEN_ITEM)).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('ArrowDown');
    // Skips sep + disabled save → export
    await expect(page.locator(EXPORT_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('ArrowDown wraps from last back to first', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('ArrowUp'); // highlight = quit
    await page.keyboard.press('ArrowDown');
    await expect(page.locator(NEW_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('Home / End jump to first / last enabled item', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('End');
    await expect(page.locator(QUIT_ITEM)).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Home');
    await expect(page.locator(NEW_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('Enter activates highlighted item, closes, fires onSelect', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('ArrowDown'); // highlight = open
    await page.keyboard.press('Enter');
    await expect(page.locator(MENU)).toBeHidden();
    await expect(page.getByTestId('log')).toContainText('onSelect(open)');
  });

  test('clicking item activates it and closes', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.locator(EXPORT_ITEM).click();
    await expect(page.locator(MENU)).toBeHidden();
    await expect(page.getByTestId('log')).toContainText('onSelect(export)');
  });

  test('clicking disabled item does nothing', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    // aria-disabled=true is treated as not-enabled by Playwright; force.
    await page.locator(SAVE_ITEM).click({ force: true });
    await expect(page.locator(MENU)).toBeVisible();
  });

  test('Escape closes the menu', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.keyboard.press('Escape');
    await expect(page.locator(MENU)).toBeHidden();
  });

  test('typeahead jumps to matching item', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('q'); // open + typeahead 'q'
    await expect(page.locator(MENU)).toBeVisible();
    await expect(page.locator(QUIT_ITEM)).toHaveAttribute('data-highlighted', '');
  });

  test('outside click closes the menu', async ({ page }) => {
    await page.goto('/sandbox/menu');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.locator(OUTSIDE).click();
    await expect(page.locator(MENU)).toBeHidden();
  });

  test('items have role=menuitem and separators have role=separator', async ({ page }) => {
    await page.goto('/sandbox/menu?initial=open');
    await waitForHydration(page);
    await expect(page.locator(NEW_ITEM)).toHaveAttribute('role', 'menuitem');
    await expect(page.locator(SAVE_ITEM)).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('[data-testid="sep-sep1"]')).toHaveAttribute('role', 'separator');
  });
});
