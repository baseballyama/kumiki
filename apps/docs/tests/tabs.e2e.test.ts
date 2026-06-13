import { test, expect, type Page } from '@playwright/test';

const TABLIST = '[data-testid="tabs-host"] [role="tablist"]';
const TABS = `${TABLIST} [role="tab"]`;
const PANEL = (value: string) => `[data-testid="panel-${value}"]`;

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${TABLIST}[id^="kumiki-tabs-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Tabs', () => {
  test('renders tablist + N tabs + N panels with proper ARIA', async ({ page }) => {
    await page.goto('/sandbox/tabs');
    await waitForHydration(page);
    await expect(page.locator(TABLIST)).toBeVisible();
    await expect(page.locator(TABLIST)).toHaveAttribute('aria-orientation', 'horizontal');
    const tabs = page.locator(TABS);
    await expect(tabs).toHaveCount(4);

    // First tab is active by default.
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(1)).toHaveAttribute('aria-disabled', 'true');
    await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');

    // Only the active panel is shown.
    await expect(page.locator(PANEL('account'))).toBeVisible();
    await expect(page.locator(PANEL('team'))).toBeHidden();
  });

  test('click selects a tab and swaps the active panel', async ({ page }) => {
    await page.goto('/sandbox/tabs');
    await waitForHydration(page);
    const tabs = page.locator(TABS);
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
    await expect(page.locator(PANEL('team'))).toBeVisible();
    await expect(page.locator(PANEL('account'))).toBeHidden();
    await expect(page.getByTestId('value')).toHaveText('team');
  });

  test('horizontal LTR: ArrowRight = next, ArrowLeft = prev (skip disabled)', async ({ page }) => {
    await page.goto('/sandbox/tabs');
    await waitForHydration(page);
    const tabs = page.locator(TABS);
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    // 0 → skip 1 (disabled) → 2 (team)
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.nth(0)).toBeFocused();
  });

  test('horizontal RTL: arrows are inverted', async ({ page }) => {
    await page.goto('/sandbox/tabs?dir=rtl');
    await waitForHydration(page);
    const tabs = page.locator(TABS);
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowLeft');
    // RTL: ArrowLeft means "next" → skip disabled → team.
    await expect(tabs.nth(2)).toBeFocused();
  });

  test('vertical: ArrowDown / ArrowUp navigate', async ({ page }) => {
    await page.goto('/sandbox/tabs?orientation=vertical');
    await waitForHydration(page);
    await expect(page.locator(TABLIST)).toHaveAttribute('aria-orientation', 'vertical');
    const tabs = page.locator(TABS);
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(2)).toBeFocused();
  });

  test('manual activation: focus moves but value stays until Enter', async ({ page }) => {
    await page.goto('/sandbox/tabs?activation=manual');
    await waitForHydration(page);
    const tabs = page.locator(TABS);
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();
    await expect(page.getByTestId('value')).toHaveText('account'); // unchanged
    await expect(page.locator(PANEL('account'))).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('value')).toHaveText('team');
    await expect(page.locator(PANEL('team'))).toBeVisible();
  });

  test('Home / End jump regardless of orientation', async ({ page }) => {
    await page.goto('/sandbox/tabs');
    await waitForHydration(page);
    const tabs = page.locator(TABS);
    await tabs.nth(0).focus();
    await page.keyboard.press('End');
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  });

  test('externally setting value updates ARIA + active panel', async ({ page }) => {
    await page.goto('/sandbox/tabs');
    await waitForHydration(page);
    const tabs = page.locator(TABS);
    await page.getByTestId('ext-set-team').click();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(PANEL('team'))).toBeVisible();
  });

  test('disabled controller: aria-disabled present on tablist', async ({ page }) => {
    await page.goto('/sandbox/tabs?disabled=1');
    await waitForHydration(page);
    await expect(page.locator(TABLIST)).toHaveAttribute('aria-disabled', 'true');
  });

  // ADR 0007 — `child` render delegation on List / Tab / Panel.
  test('child delegation: roles + ARIA + interaction preserved on custom elements', async ({
    page,
  }) => {
    await page.goto('/sandbox/tabs?child=1');
    await waitForHydration(page);

    // Delegated elements carry the spread declarative props (roles intact).
    await expect(page.locator(`${TABLIST}[data-delegated="list"]`)).toBeVisible();
    await expect(page.locator(TABLIST)).toHaveAttribute('aria-orientation', 'horizontal');

    const tabs = page.locator(`${TABS}[data-delegated="tab"]`);
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(1)).toHaveAttribute('aria-disabled', 'true');

    // Delegated panel is a <section> but keeps role=tabpanel + visibility wiring.
    await expect(page.locator(`section${PANEL('account')}`)).toBeVisible();
    await expect(page.locator(PANEL('team'))).toBeHidden();

    // Attachment wires interaction on the delegated <button>.
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator(PANEL('team'))).toBeVisible();
    await expect(page.locator(PANEL('account'))).toBeHidden();
  });
});
