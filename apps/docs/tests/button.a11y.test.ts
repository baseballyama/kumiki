import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/button', label: 'idle' },
  { url: '/sandbox/button?disabled=1', label: 'disabled' },
  { url: '/sandbox/button?loading=1', label: 'loading' },
  { url: '/sandbox/button?variant=danger', label: 'danger' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Button ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.locator('[data-component="button"] button').first()).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-component="button"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
