import { test, expect } from '@playwright/test';

/**
 * SSR smoke test.
 *
 * Visits every sandbox route with JavaScript *disabled* (configured at the
 * playwright project level) and asserts the route renders meaningful HTML
 * server-side. This catches the regression class flagged in
 * `docs/release/v1-execution-plan.md` Track A-3 #2: any Layer 4 / 5 component
 * that secretly reads `document.` / `window.` at module scope, or throws in
 * its render function under SSR, will fail this test.
 *
 * Each entry pairs the sandbox slug with a CSS selector that must appear in
 * the SSR'd HTML — typically a `data-testid`, but the bare-metal Layer 3
 * test fixture is anchored on its host button instead. The point of the
 * anchor is to prove the *component* rendered, not just the layout shell.
 */
const SANDBOX_ANCHORS: ReadonlyArray<readonly [slug: string, anchor: string]> = [
  ['accordion', '[data-testid="accordion-host"]'],
  ['alert', '[data-component="alert"]'],
  ['atelier-dialog', 'h1'],
  ['atelier-gallery', 'h1'],
  ['atelier-toggle', 'h1'],
  ['avatar', '[data-component="avatar"]'],
  ['avatar-group', '[data-component="avatar-group"]'],
  ['badge', '[data-component="badge"]'],
  ['breadcrumb', '[data-component="breadcrumb"]'],
  ['button', '[data-component="button"]'],
  ['calendar', '[data-testid="value"]'],
  ['checkbox', '[data-component="checkbox"]'],
  ['chips', '[data-component="chips"]'],
  ['combobox', '[data-testid="combobox-host"]'],
  ['combobox-async', '[data-testid="cb-host"]'],
  ['date-picker', '[data-testid="value"]'],
  ['datetime-field', '[data-component="datetime-field"]'],
  ['definition-list', '[data-component="definition-list"]'],
  ['dialog', '[data-testid="dialog-host"]'],
  ['form-field', '[data-testid="field-host"]'],
  ['horizontal-rule', '[data-component="horizontal-rule"]'],
  ['icon-button', '[data-component="icon-button"]'],
  ['loading-spinner', '[data-component="loading-spinner"]'],
  ['menu', '[data-testid="menu-host"]'],
  ['number-field', '[data-testid="number-field-host"]'],
  ['pagination', '[data-component="pagination"]'],
  ['popconfirm', '[data-component="popconfirm"]'],
  ['popover', '[data-testid="popover-host"]'],
  ['radio-group', '[data-testid="rg-host"]'],
  ['select', '[data-testid="select-host"]'],
  ['slider', '[data-testid="slider-host"]'],
  ['switch', '[data-component="switch"]'],
  ['table', '[data-component="table"]'],
  ['tabs', '[data-testid="tabs-host"]'],
  ['time-field', '[data-component="time-field"]'],
  ['toast', '[data-testid="toast-host"]'],
  ['toggle', '[data-component="toggle"]'],
  ['toggle-bare', '[data-testid="bare-toggle"]'],
  ['toggle-group', '[data-component="toggle-group"]'],
  ['toolbar', '[data-component="toolbar"]'],
  ['tooltip', '[data-testid="tooltip-host"]'],
];

test.describe('SSR smoke', () => {
  for (const [slug, anchor] of SANDBOX_ANCHORS) {
    test(`/sandbox/${slug} renders without JS`, async ({ page }) => {
      const response = await page.goto(`/sandbox/${slug}`);
      expect(response, 'navigation must produce a response').not.toBeNull();
      expect(response!.status(), 'route must serve 200 from SSR').toBe(200);
      // The component-specific anchor must exist in the parsed DOM. With JS
      // disabled, the only DOM is what arrived in the SSR'd HTML — so this
      // assertion fails if the component skipped its server render.
      await expect(page.locator(anchor).first()).toBeAttached();
    });
  }
});
