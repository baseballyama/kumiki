/**
 * Catches color-contrast regressions in the Layer 5 (atelier) presets.
 *
 * `button.a11y.test.ts` runs axe against `sandbox/button`, but that sandbox
 * imports `@kumiki/components/button` (Layer 4 — no styling). So a danger
 * variant with a 4.28:1 white-on-red foreground slips past as long as no
 * atelier CSS is in the DOM. This file targets `sandbox/atelier-gallery`,
 * which renders every atelier preset (button, badge, alert, chips, …) and
 * is where contrast regressions actually surface.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const DIRECTIONS = ['ltr', 'rtl'] as const;

for (const dir of DIRECTIONS) {
  test(`Atelier gallery ${dir} has no contrast violations`, async ({ page }) => {
    await page.goto(`/sandbox/atelier-gallery?dir=${dir}`);
    await expect(page.locator('main.page')).toBeVisible();
    // Scope to color-contrast rules only — the gallery nests under the root
    // <main>, so structural / landmark rules emit duplicate-main false
    // positives that aren't what this test is for. Per-component sandboxes
    // already cover the other rules.
    const results = await new AxeBuilder({ page })
      .include('main.page')
      .options({ runOnly: ['color-contrast'] })
      .analyze();
    expect(
      results.violations,
      `axe found contrast violations in atelier-gallery/${dir}: ${JSON.stringify(results.violations, null, 2)}`,
    ).toEqual([]);
  });
}
