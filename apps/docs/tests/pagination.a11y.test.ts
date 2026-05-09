import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [{ url: '/sandbox/pagination', label: 'default' }];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Pagination ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      const results = await new AxeBuilder({ page })
        .include('[data-component="pagination"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
