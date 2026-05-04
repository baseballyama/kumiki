import { test, expect, type Page } from '@playwright/test';

const TRIGGER = '[data-testid="trigger"]';
const LISTBOX = '[data-testid="listbox"]';
const OPT = (v: string) => `[data-testid="opt-${v}"]`;

async function waitForHydration(page: Page): Promise<void> {
  // Wait for the listbox attachment to paint its id — the SSR template
  // only carries role + aria-labelledby; the id is painted client-side and
  // is the cleanest signal that all attachments have wired their listeners.
  await expect(page.locator(`${LISTBOX}[id^="kumiki-select-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Select', () => {
  test('renders trigger + listbox closed with correct ARIA', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(LISTBOX)).toBeHidden();
  });

  test('clicking the trigger opens the listbox', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(TRIGGER)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(LISTBOX)).toBeVisible();
  });

  test('clicking an option commits and closes', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await page.locator(OPT('cherry')).click();
    await expect(page.locator(LISTBOX)).toBeHidden();
    await expect(page.getByTestId('value')).toHaveText('cherry');
    await expect(page.locator(TRIGGER)).toContainText('Cherry');
  });

  test('keyboard: ArrowDown navigates skipping disabled, Enter commits', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('Enter'); // open
    await expect(page.locator(LISTBOX)).toBeVisible();
    await page.keyboard.press('ArrowDown'); // s-a → skip s-b → s-c
    await page.keyboard.press('Enter');
    await expect(page.locator(LISTBOX)).toBeHidden();
    await expect(page.getByTestId('value')).toHaveText('cherry');
  });

  test('Escape closes', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await expect(page.locator(LISTBOX)).toBeHidden();
  });

  test('typeahead jumps highlighted', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('c'); // opens + highlights cherry
    await expect(page.locator(LISTBOX)).toBeVisible();
    await expect(page.locator(OPT('cherry'))).toHaveAttribute('data-highlighted', '');
  });

  test('Home / End jump while open', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('End');
    await expect(page.locator(OPT('date'))).toHaveAttribute('data-highlighted', '');
    await page.keyboard.press('Home');
    await expect(page.locator(OPT('apple'))).toHaveAttribute('data-highlighted', '');
  });

  test('outside-click closes', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.locator(TRIGGER).click();
    await expect(page.locator(LISTBOX)).toBeVisible();
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await expect(page.locator(LISTBOX)).toBeHidden();
  });

  test('externally setting value updates trigger label', async ({ page }) => {
    await page.goto('/sandbox/select');
    await waitForHydration(page);
    await page.getByTestId('ext-set-cherry').click();
    await expect(page.locator(TRIGGER)).toContainText('Cherry');
  });
});
