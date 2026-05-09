import { test, expect, type Page } from '@playwright/test';

const INPUT = '[data-testid="input"]';
const ERRORS = '[data-testid="errors"]';
const LABEL = '[data-testid="label"]';

async function waitForHydration(page: Page): Promise<void> {
  await expect(page.locator(`${INPUT}[id^="kumiki-form-field-"]`)).toBeAttached({
    timeout: 5000,
  });
}

test.describe('Form-Field', () => {
  test('renders label + input + errors with proper ARIA', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    const inputId = await page.locator(INPUT).getAttribute('id');
    expect(inputId).toMatch(/^kumiki-form-field-.+-input$/);
    await expect(page.locator(LABEL)).toHaveAttribute('for', inputId!);
    await expect(page.locator(INPUT)).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator(ERRORS)).toBeHidden();
  });

  test('blur after typing triggers sync validation → invalid + aria-invalid=true', async ({
    page,
  }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('ab');
    await page.locator(INPUT).blur();
    await expect(page.locator(INPUT)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(ERRORS)).toBeVisible();
    await expect(page.locator(ERRORS)).toContainText('at least 3 characters');
  });

  test('valid input passes', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('kumiki');
    await page.locator(INPUT).blur();
    await expect(page.locator(INPUT)).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator(ERRORS)).toBeHidden();
  });

  test('blur from pristine does not show errors', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).blur();
    // No INPUT event → state stays pristine, no validation runs.
    await expect(page.locator(INPUT)).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator(ERRORS)).toBeHidden();
  });

  test('typing after invalid clears errors immediately', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('a');
    await page.locator(INPUT).blur();
    await expect(page.locator(ERRORS)).toBeVisible();
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('bc');
    await expect(page.locator(ERRORS)).toBeHidden();
  });

  test('aria-describedby includes errors id when invalid', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('a');
    await page.locator(INPUT).blur();
    const desc = await page.locator(INPUT).getAttribute('aria-describedby');
    const errId = await page.locator(ERRORS).getAttribute('id');
    expect(desc).toContain(errId!);
  });

  test('async validator: invalid input shows async error message', async ({ page }) => {
    await page.goto('/sandbox/form-field?validator=async');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('a');
    await page.locator(INPUT).blur();
    await expect(page.locator(ERRORS)).toContainText('async');
  });

  test('validateOn=change runs validation on each keystroke', async ({ page }) => {
    await page.goto('/sandbox/form-field?validateOn=change');
    await waitForHydration(page);
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('a');
    await expect(page.locator(ERRORS)).toBeVisible();
    await page.locator(INPUT).pressSequentially('bc');
    await expect(page.locator(ERRORS)).toBeHidden();
  });

  test('externally setting value reflects in DOM input.value', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.getByTestId('ext-set').click();
    await expect(page.locator(INPUT)).toHaveValue('kumiki');
  });

  test('Root-level `name` propagates to the underlying input', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await expect(page.locator(INPUT)).toHaveAttribute('name', 'username');
  });

  test('serverIssues drives the field invalid + clearing returns to valid', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.getByTestId('server-error').click();
    await expect(page.locator(INPUT)).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator(ERRORS)).toContainText('Username already taken');
    await page.getByTestId('server-clear').click();
    await expect(page.locator(INPUT)).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator(ERRORS)).toBeHidden();
  });

  test('typing after a server error clears the server message', async ({ page }) => {
    await page.goto('/sandbox/form-field');
    await waitForHydration(page);
    await page.getByTestId('server-error').click();
    await expect(page.locator(ERRORS)).toContainText('Username already taken');
    await page.locator(INPUT).focus();
    await page.locator(INPUT).pressSequentially('newvalue');
    await expect(page.locator(ERRORS)).toBeHidden();
  });
});
