import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/tabs', label: 'idle-automatic-horizontal' },
  { url: '/sandbox/tabs?activation=manual', label: 'manual' },
  { url: '/sandbox/tabs?orientation=vertical', label: 'vertical' },
  { url: '/sandbox/tabs?disabled=1', label: 'disabled' },
  { url: '/sandbox/tabs?child=1', label: 'child-delegation' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Tabs ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.getByRole('tablist')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-component-host="tabs"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
