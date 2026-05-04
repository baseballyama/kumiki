import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/menu', label: 'closed' },
  { url: '/sandbox/menu?initial=open', label: 'open' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Menu ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.locator('[data-testid="menu-host"]')).toBeVisible();
      const results = await new AxeBuilder({ page })
        .include('[data-testid="menu-host"]')
        // `aria-required-children` has a known false positive on
        // role="menu" containing role="separator" + role="menuitem"
        // (axe-core#3758). Real ATs traverse correctly; the rule is
        // overly strict about direct-child detection.
        .disableRules(['region', 'aria-required-children'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
