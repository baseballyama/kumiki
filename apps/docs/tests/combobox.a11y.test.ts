import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/combobox', label: 'closed' },
  { url: '/sandbox/combobox?disabled=1', label: 'disabled' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Combobox ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.getByRole('combobox')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-component-host="combobox"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}

test('Combobox open state has no axe violations', async ({ page }) => {
  await page.goto('/sandbox/combobox');
  await expect(page.getByRole('combobox')).toBeVisible();
  await page.getByRole('combobox').focus();
  await expect(page.getByRole('listbox')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include('[data-component-host="combobox"]')
    .disableRules(['region'])
    .analyze();
  expect(results.violations).toEqual([]);
});
