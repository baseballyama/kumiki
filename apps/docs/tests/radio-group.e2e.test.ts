import { test, expect, type Page } from '@playwright/test';

const GROUP = '[data-testid="rg-host"] [role="radiogroup"]';
const ITEMS = `${GROUP} [role="radio"]`;

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${GROUP}[id^="kumiki-radio-group-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('RadioGroup', () => {
  test('renders role=radiogroup with N radios + roving tabindex', async ({ page }) => {
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    await expect(page.locator(GROUP)).toBeVisible();
    const radios = page.locator(ITEMS);
    await expect(radios).toHaveCount(4);
    // First enabled item gets tabindex=0; rest -1.
    await expect(radios.nth(0)).toHaveAttribute('tabindex', '0');
    await expect(radios.nth(1)).toHaveAttribute('tabindex', '-1');
    await expect(radios.nth(1)).toHaveAttribute('aria-disabled', 'true');
  });

  test('click selects a radio and updates aria-checked', async ({ page }) => {
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    const radios = page.locator(ITEMS);
    await radios.nth(2).click();
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
    await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByTestId('value')).toHaveText('cherry');
  });

  test('arrow keys navigate AND select (skip disabled)', async ({ page }) => {
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    const radios = page.locator(ITEMS);
    await radios.nth(0).focus();
    await page.keyboard.press('ArrowDown');
    // Skips disabled banana → cherry.
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
    await expect(radios.nth(2)).toHaveAttribute('tabindex', '0');
    await expect(radios.nth(0)).toHaveAttribute('tabindex', '-1');
  });

  test('Home / End jump', async ({ page }) => {
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    const radios = page.locator(ITEMS);
    await radios.nth(0).focus();
    await page.keyboard.press('End');
    await expect(radios.nth(3)).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('Home');
    await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
  });

  test('disabled item cannot be selected by click', async ({ page }) => {
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    const radios = page.locator(ITEMS);
    await radios.nth(1).click({ force: true });
    await expect(page.getByTestId('value')).toHaveText('null');
  });

  test('externally setting value updates ARIA', async ({ page }) => {
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    const radios = page.locator(ITEMS);
    await page.getByTestId('ext-set-cherry').click();
    await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
  });

  test('disabled group: aria-disabled present', async ({ page }) => {
    await page.goto('/sandbox/radio-group?disabled=1');
    await waitForHydration(page);
    await expect(page.locator(GROUP)).toHaveAttribute('aria-disabled', 'true');
  });

  test('onValueChange fires on every value transition', async ({ page }) => {
    // Unlike Toggle/Switch/Checkbox where onCheckedChange is user-only, the
    // RadioGroup callback fires for any value transition — including SET.VALUE
    // from outside. This matches the semantics of "the selected radio changed",
    // which is what consumers care about for form bindings.
    await page.goto('/sandbox/radio-group');
    await waitForHydration(page);
    await page.locator(ITEMS).nth(0).click();
    await expect(page.getByTestId('log')).toContainText('onValueChange(apple)');
    await page.getByTestId('ext-set-cherry').click();
    await expect(page.getByTestId('log')).toContainText('onValueChange(cherry)');
  });
});
