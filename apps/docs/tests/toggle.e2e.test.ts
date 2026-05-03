import { test, expect, type Page } from '@playwright/test';

// We locate the Toggle by `data-testid`, not by accessible name, because the
// accessible name flips ("Off" / "On") with state and would invalidate locators
// across .click() boundaries.
const TOGGLE = '[data-testid="toggle-host"] > button';

/**
 * Wait for the Layer 4 attachment to attach. The attachment sets `id="kumiki-toggle-..."`
 * on the host element after hydration, so the presence of an `id` is a reliable
 * post-hydration signal. Without this guard, Playwright can dispatch clicks to
 * the SSR'd-but-not-yet-hydrated button — they hit nothing.
 */
async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${TOGGLE}[id^="kumiki-toggle-"]`)).toBeAttached({ timeout: 5000 });
}

test.describe('Toggle', () => {
  test('renders unpressed by default', async ({ page }) => {
    await page.goto('/sandbox/toggle');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await expect(btn).toHaveAttribute('data-state', 'off');
    await expect(btn).toHaveText('Off');
  });

  test('renders pressed when initial=on', async ({ page }) => {
    await page.goto('/sandbox/toggle?initial=on');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(btn).toHaveAttribute('data-state', 'on');
    await expect(btn).toHaveText('On');
  });

  test('click toggles aria-pressed and data-state', async ({ page }) => {
    await page.goto('/sandbox/toggle');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(btn).toHaveAttribute('data-state', 'on');
    await expect(btn).toHaveText('On');
  });

  test('Space key toggles', async ({ page }) => {
    await page.goto('/sandbox/toggle');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await btn.focus();
    await page.keyboard.press('Space');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  test('Enter key toggles', async ({ page }) => {
    await page.goto('/sandbox/toggle');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  test('disabled toggle does not respond to clicks', async ({ page }) => {
    await page.goto('/sandbox/toggle?disabled=1');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await expect(btn).toHaveAttribute('aria-disabled', 'true');
    await expect(btn).toHaveAttribute('data-disabled', '');
    // `aria-disabled` makes Playwright refuse a normal .click() on actionability
    // grounds. We bypass to verify the *behavior*: a click that does reach the
    // element must be ignored by the machine.
    await btn.click({ force: true });
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('pressed')).toHaveText('false');
  });

  test('onPressedChange fires only on user interaction', async ({ page }) => {
    await page.goto('/sandbox/toggle');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);

    // User click → callback fires.
    await btn.click();
    await expect(page.getByTestId('log')).toContainText('onPressedChange(true)');

    // External (controlled) update → callback does NOT fire.
    await page.getByTestId('ext-set-false').click();
    await expect(page.getByTestId('pressed')).toHaveText('false');
    const logItems = page.locator('[data-testid="log"] li');
    await expect(logItems).toHaveCount(1);
  });

  test('externally setting pressed updates ARIA', async ({ page }) => {
    await page.goto('/sandbox/toggle');
    await waitForHydration(page);
    const btn = page.locator(TOGGLE);
    await page.getByTestId('ext-set-true').click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(btn).toHaveAttribute('data-state', 'on');
  });

  test('RTL: dir attribute is forwarded', async ({ page }) => {
    await page.goto('/sandbox/toggle?dir=rtl');
    await waitForHydration(page);
    const wrapper = page.getByTestId('sandbox');
    await expect(wrapper).toHaveAttribute('dir', 'rtl');
  });
});
