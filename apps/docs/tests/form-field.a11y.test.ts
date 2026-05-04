import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/form-field', label: 'pristine' },
  { url: '/sandbox/form-field?initial=ab', label: 'with-initial' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Form-Field ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.locator('[data-component-host="form-field"]')).toBeVisible();
      // Wait for the input attachment to paint its id so the label's `for`
      // attribute resolves before axe runs.
      await expect(page.locator('input[id^="kumiki-form-field-"]')).toBeAttached({
        timeout: 5000,
      });
      const results = await new AxeBuilder({ page })
        .include('[data-testid="field-host"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
