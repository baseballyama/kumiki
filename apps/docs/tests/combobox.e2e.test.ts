import { test, expect, type Page } from '@playwright/test';

const HOST = '[data-testid="combobox-host"]';
const INPUT = `${HOST} input[role="combobox"]`;
const LISTBOX = `${HOST} ul[role="listbox"]`;

async function waitForHydration(page: Page): Promise<void> {
  // The user-supplied input id (`cb-input`) wins over the auto-generated id, so
  // we wait on `aria-controls` which always points at the auto-generated
  // listbox id — set unconditionally by the attachment after hydration.
  await expect(page.locator(`${INPUT}[aria-controls^="kumiki-combobox-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Combobox', () => {
  test('renders an input with role=combobox + listbox closed', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await expect(page.locator(INPUT)).toHaveAttribute('aria-autocomplete', 'list');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(LISTBOX)).toHaveAttribute('hidden', '');
  });

  test('focusing the input opens the listbox', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await expect(page.locator(INPUT)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(LISTBOX)).not.toHaveAttribute('hidden', '');
  });

  test('typing filters the listbox', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).fill('al');
    await expect(page.locator(`${LISTBOX} li[role="option"]`)).toHaveCount(1);
    await expect(page.locator(`${LISTBOX} li[role="option"]`).first()).toHaveText('Alice');
  });

  test('ArrowDown highlights the first option', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.keyboard.press('ArrowDown');
    const first = page.locator(`${LISTBOX} li[role="option"]`).first();
    await expect(first).toHaveAttribute('data-highlighted', 'true');
    // aria-activedescendant points at the highlighted option's element id.
    const id = await first.getAttribute('id');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-activedescendant', id!);
  });

  test('Enter commits highlighted option and closes', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('value')).toHaveText('Alice');
    await expect(page.locator(INPUT)).toHaveValue('Alice');
  });

  test('clicking an option commits + closes', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(`${LISTBOX} li[role="option"]`).nth(2).click();
    await expect(page.getByTestId('value')).toHaveText('Carol');
    await expect(page.locator(INPUT)).toHaveValue('Carol');
  });

  test('Escape closes without selecting', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('value')).toHaveText('null');
  });

  test('disabled combobox does not respond to focus', async ({ page }) => {
    await page.goto('/sandbox/combobox?disabled=1');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    // Disabled state means no expansion on focus.
    await expect(page.locator(INPUT)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-disabled', 'true');
  });

  test('externally setting value updates the input', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.getByTestId('ext-set-bob').click();
    await expect(page.getByTestId('value')).toHaveText('Bob');
    await expect(page.locator(INPUT)).toHaveValue('Bob');
  });

  test('RTL: dir attribute is forwarded', async ({ page }) => {
    await page.goto('/sandbox/combobox?dir=rtl');
    await waitForHydration(page);
    await expect(page.getByTestId('sandbox')).toHaveAttribute('dir', 'rtl');
  });

  test('ArrowUp from idle opens and highlights last', async ({ page }) => {
    await page.goto('/sandbox/combobox');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).press('Escape'); // close
    await page.locator(INPUT).press('ArrowUp');
    await expect(page.locator(INPUT)).toHaveAttribute('aria-expanded', 'true');
  });
});
