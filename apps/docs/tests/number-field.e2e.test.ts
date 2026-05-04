import { test, expect, type Page } from '@playwright/test';

const ROOT = '[data-testid="number-field-host"] [data-component-host="number-field"]';
const INPUT = '[data-testid="input"]';
const INC = '[data-testid="increment"]';
const DEC = '[data-testid="decrement"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${ROOT}[id^="kumiki-number-field-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('NumberField', () => {
  test('renders input with role=spinbutton and ARIA bounds', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    const input = page.locator(INPUT);
    await expect(input).toHaveAttribute('role', 'spinbutton');
    await expect(input).toHaveAttribute('aria-valuemin', '0');
    await expect(input).toHaveAttribute('aria-valuemax', '10');
    await expect(input).toHaveAttribute('aria-valuenow', '5');
    await expect(input).toHaveValue('5');
  });

  test('ArrowUp increments, ArrowDown decrements', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByTestId('value')).toHaveText('6');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('value')).toHaveText('5');
  });

  test('PageUp / PageDown use pageStep', async ({ page }) => {
    await page.goto('/sandbox/number-field?min=0&max=100&step=1&initial=50');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.keyboard.press('PageUp');
    await expect(page.getByTestId('value')).toHaveText('60');
    await page.keyboard.press('PageDown');
    await expect(page.getByTestId('value')).toHaveText('50');
  });

  test('Home / End jump to bounds', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.keyboard.press('End');
    await expect(page.getByTestId('value')).toHaveText('10');
    await page.keyboard.press('Home');
    await expect(page.getByTestId('value')).toHaveText('0');
  });

  test('clicking increment / decrement steps', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    await page.locator(INC).click();
    await expect(page.getByTestId('value')).toHaveText('6');
    await page.locator(DEC).click();
    await expect(page.getByTestId('value')).toHaveText('5');
  });

  test('increment disabled at max', async ({ page }) => {
    await page.goto('/sandbox/number-field?initial=10');
    await waitForHydration(page);
    await expect(page.locator(INC)).toBeDisabled();
    await expect(page.locator(DEC)).toBeEnabled();
  });

  test('decrement disabled at min', async ({ page }) => {
    await page.goto('/sandbox/number-field?initial=0');
    await waitForHydration(page);
    await expect(page.locator(DEC)).toBeDisabled();
    await expect(page.locator(INC)).toBeEnabled();
  });

  test('typing then blur commits the value', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    const input = page.locator(INPUT);
    await input.click();
    await input.fill('8');
    await input.blur();
    await expect(page.getByTestId('value')).toHaveText('8');
    await expect(input).toHaveAttribute('aria-valuenow', '8');
  });

  test('typing invalid then blur restores prior value', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    const input = page.locator(INPUT);
    await input.click();
    await input.fill('banana');
    await input.blur();
    await expect(input).toHaveValue('5');
    await expect(page.getByTestId('value')).toHaveText('5');
  });

  test('Enter commits the value', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    const input = page.locator(INPUT);
    await input.click();
    await input.fill('7');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('value')).toHaveText('7');
  });

  test('externally clearing value drops aria-valuenow', async ({ page }) => {
    await page.goto('/sandbox/number-field');
    await waitForHydration(page);
    await page.getByTestId('ext-clear').click();
    const input = page.locator(INPUT);
    await expect(input).not.toHaveAttribute('aria-valuenow', /.*/);
    await expect(input).toHaveValue('');
  });

  test('disabled: input ARIA-disabled, buttons disabled, keyboard ignored', async ({ page }) => {
    await page.goto('/sandbox/number-field?disabled=1');
    await waitForHydration(page);
    const input = page.locator(INPUT);
    await expect(input).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator(INC)).toBeDisabled();
    await expect(page.locator(DEC)).toBeDisabled();
    await input.focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByTestId('value')).toHaveText('5');
  });
});
