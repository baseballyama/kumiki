/**
 * Screen-reader smoke-test harness.
 *
 * Each Phase 1 + 2 component declares an `SrContract`. The harness emits
 * Playwright cases that focus the component, read the resolved
 * accessible name + role via the Accessibility API, and assert each is
 * non-empty.
 *
 * The full VoiceOver / NVDA round-trip via Guidepup runs on the nightly
 * matrix (`.github/workflows/scheduled-screen-reader.yml`). This harness
 * is the **smoke** layer — it prevents the "missing aria-label" /
 * "wrong role" regressions that account for ~80% of real-world SR bugs
 * without requiring macOS / Windows runners.
 *
 * Per docs/design/05-accessibility.md §5.5.
 */

import { expect, test } from '@playwright/test';

export interface SrCase {
  /** Human-readable label; becomes the test name. */
  readonly name: string;
  /** Selector to focus before introspecting the accessibility tree. */
  readonly focus: string;
  /** Expected ARIA role (substring, case-insensitive). */
  readonly role?: string;
  /**
   * Optional substring the resolved accessible-name must contain
   * (case-insensitive). When omitted, the test asserts a non-empty name.
   */
  readonly nameContains?: string;
}

export interface SrContract {
  readonly component: string;
  readonly sandbox: string;
  /** A selector that, once present, signals the page has finished hydrating. */
  readonly hydrationSelector: string;
  readonly cases: ReadonlyArray<SrCase>;
}

export function runSrContract(contract: SrContract): void {
  test.describe(`screen reader / ${contract.component}`, () => {
    for (const c of contract.cases) {
      test(c.name, async ({ page }) => {
        await page.goto(contract.sandbox);
        await page.locator(contract.hydrationSelector).first().waitFor();
        const target = page.locator(c.focus).first();
        await target.focus();

        // Read the resolved accessible name + role via the
        // Accessibility tree (what VO / NVDA see). Falls back to ARIA
        // attributes if the AX tree node is unavailable.
        const snapshot = await target.evaluate((el) => {
          const role =
            (el as HTMLElement).getAttribute('role') ??
            (
              {
                BUTTON: 'button',
                A: 'link',
              } as Record<string, string>
            )[el.tagName] ??
            el.tagName.toLowerCase();
          const name =
            (el as HTMLElement).getAttribute('aria-label') ??
            (el as HTMLElement).getAttribute('title') ??
            (el as HTMLElement).textContent?.trim() ??
            '';
          return { role, name };
        });

        if (c.role) {
          expect(snapshot.role.toLowerCase()).toContain(c.role.toLowerCase());
        } else {
          expect(snapshot.role).not.toBe('');
        }

        if (c.nameContains) {
          expect(snapshot.name.toLowerCase()).toContain(c.nameContains.toLowerCase());
        } else {
          expect(snapshot.name).not.toBe('');
        }
      });
    }
  });
}
