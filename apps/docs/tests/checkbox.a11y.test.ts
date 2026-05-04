import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/checkbox', label: 'unchecked' },
  { url: '/sandbox/checkbox?initial=checked', label: 'checked' },
  { url: '/sandbox/checkbox?initial=mixed', label: 'mixed' },
  { url: '/sandbox/checkbox?disabled=1', label: 'disabled' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Checkbox ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.getByRole('checkbox')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-component="checkbox"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
