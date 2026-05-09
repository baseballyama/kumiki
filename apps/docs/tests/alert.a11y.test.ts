import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/alert?severity=info', label: 'info' },
  { url: '/sandbox/alert?severity=success', label: 'success' },
  { url: '/sandbox/alert?severity=warn', label: 'warn' },
  { url: '/sandbox/alert?severity=error', label: 'error' },
  { url: '/sandbox/alert?severity=info&dismissible=1', label: 'dismissible' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Alert ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      const results = await new AxeBuilder({ page })
        .include('[data-component="alert"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
