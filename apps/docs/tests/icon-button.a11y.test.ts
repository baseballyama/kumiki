import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/icon-button', label: 'idle' },
  { url: '/sandbox/icon-button?disabled=1', label: 'disabled' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`IconButton ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.locator('[data-icon-only]').first()).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-component="icon-button"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
