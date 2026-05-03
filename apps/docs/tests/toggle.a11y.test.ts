import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/toggle', label: 'unpressed' },
  { url: '/sandbox/toggle?initial=on', label: 'pressed' },
  { url: '/sandbox/toggle?disabled=1', label: 'disabled' },
];

const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Toggle ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      // Wait for the toggle to render before scanning.
      await expect(page.getByRole('button').first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        .include('[data-component="toggle"]')
        // Sandbox fixtures don't have <main> landmarks; not a component-level concern.
        .disableRules(['region'])
        .analyze();

      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
