import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const STATES = [
  { url: '/sandbox/combobox', label: 'closed' },
  { url: '/sandbox/combobox?disabled=1', label: 'disabled' },
];
const DIRECTIONS = ['ltr', 'rtl'] as const;

// The attachment sets `aria-controls="kumiki-combobox-…"` on the input only
// after hydration. Scanning (or focusing) before that races the attachment, so
// every test waits on it first — otherwise axe sees half-wired markup and
// focus() never opens the listbox.
async function waitForHydration(page: Page): Promise<void> {
  await expect(
    page.locator('[data-component-host="combobox"] input[aria-controls^="kumiki-combobox-"]'),
  ).toBeAttached({ timeout: 5000 });
}

for (const dir of DIRECTIONS) {
  for (const state of STATES) {
    test(`Combobox ${dir} ${state.label} has no axe violations`, async ({ page }) => {
      const url = state.url + (state.url.includes('?') ? '&' : '?') + `dir=${dir}`;
      await page.goto(url);
      await waitForHydration(page);
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
  await waitForHydration(page);
  // Scope to the sandbox host: the docs header's language `<select>` also
  // exposes role=combobox, so an unscoped getByRole is ambiguous.
  const host = page.locator('[data-component-host="combobox"]');
  await host.locator('input[role="combobox"]').focus();
  await expect(host.locator('ul[role="listbox"]')).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include('[data-component-host="combobox"]')
    .disableRules(['region'])
    .analyze();
  expect(results.violations).toEqual([]);
});
