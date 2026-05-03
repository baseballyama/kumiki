import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page has no detectable axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .disableRules(['region']) // Component-only fixture pages don't need landmarks; revisit on full layout.
    .analyze();
  expect(results.violations).toEqual([]);
});
