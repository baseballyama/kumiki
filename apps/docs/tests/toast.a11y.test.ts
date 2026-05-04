import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/toast?duration=60000', label: 'idle' },
  { url: '/sandbox/toast?duration=60000', label: 'with-toast', addAction: 'add-info' as const },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Toast ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await expect(page.locator('[data-testid="toast-host"]')).toBeVisible();
      if (state.addAction) {
        // Wait for hydration before clicking — the viewport gets its
        // kumiki-toast-* id only once the controller's attachment runs.
        await expect(page.locator('[data-testid="viewport"][id^="kumiki-toast-"]')).toBeAttached({
          timeout: 5000,
        });
        await page.locator(`[data-testid="${state.addAction}"]`).click();
        await expect(page.locator('[data-testid="toast"]')).toHaveCount(1);
      }
      const results = await new AxeBuilder({ page })
        .include('[data-testid="toast-host"]')
        .disableRules(['region'])
        .analyze();
      expect(
        results.violations,
        `axe found violations in ${dir}/${state.label}: ${JSON.stringify(results.violations, null, 2)}`,
      ).toEqual([]);
    });
  }
}
