/**
 * APG keyboard test harness.
 *
 * Each Phase 1 component declares a `KeyboardContract` describing the
 * APG-specified keyboard interactions. The harness consumes the contract
 * and emits one Playwright test per case, navigating to the sandbox URL,
 * dispatching the key, and asserting the resulting state.
 *
 * Per docs/design/05-accessibility.md §5.4. Storing contracts as TypeScript
 * objects (rather than YAML) keeps the harness dep-free and gives us
 * type-safety on the key names + assertion shapes.
 *
 * Adding a key the APG documents but the contract omits → eventually a CI
 * failure (Phase 0c+: a small scraper diffs the published APG table at
 * build time). For now the contract is hand-transcribed.
 */

import { test, expect, type Page } from '@playwright/test';

export type APGKey =
  | 'Tab'
  | 'Shift+Tab'
  | 'Enter'
  | ' '
  | 'Escape'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'
  | (string & {});

export interface AttributeAssertion {
  /** Selector resolved on the page. */
  selector: string;
  /** Attribute name to read. */
  attribute: string;
  /** Expected value (exact match). */
  value: string;
}

export interface FocusAssertion {
  /** Selector that should be the active element after the keypress. */
  focused: string;
}

export interface VisibilityAssertion {
  /** Selector that should be visible / hidden. */
  selector: string;
  /** True for visible, false for hidden. */
  visible: boolean;
}

export type ExpectAssertion = AttributeAssertion | FocusAssertion | VisibilityAssertion;

export interface KeyboardCase {
  /** Human-readable case label. Becomes the test name. */
  name: string;
  /**
   * Sandbox URL — defaults to the contract's `sandbox` field. Override per
   * case to seed a different initial state via query params.
   */
  url?: string;
  /**
   * Selector to focus before the key is pressed. Required — APG keyboard
   * tests are inherently focus-relative.
   */
  focus: string;
  /**
   * Key (or `+`-joined chord) to press. Mirrors Playwright's
   * `page.keyboard.press()` syntax — for case-sensitive cross-platform
   * equivalence.
   */
  press: APGKey;
  /**
   * Optional sequence of preliminary keypresses before `press`. Use for
   * "after typing 3 characters, press Escape" cases.
   */
  prelude?: ReadonlyArray<APGKey>;
  /** Assertions to verify after the keypress. */
  expect: ReadonlyArray<ExpectAssertion>;
}

export interface KeyboardContract {
  /** Component slug — drives the test group name. */
  component: string;
  /** APG pattern URL for the component. */
  apg: string;
  /** Default sandbox URL. */
  sandbox: string;
  /** All cases to run. */
  cases: ReadonlyArray<KeyboardCase>;
}

async function applyAssertion(page: Page, a: ExpectAssertion): Promise<void> {
  if ('focused' in a) {
    await expect(page.locator(a.focused)).toBeFocused();
    return;
  }
  if ('attribute' in a) {
    await expect(page.locator(a.selector)).toHaveAttribute(a.attribute, a.value);
    return;
  }
  if (a.visible) {
    await expect(page.locator(a.selector)).toBeVisible();
  } else {
    await expect(page.locator(a.selector)).toBeHidden();
  }
}

/**
 * Generate tests for one component's keyboard contract.
 *
 * @example
 * import { runKeyboardContract } from './_harness';
 * import { tabsKeyboardContract } from '../../keyboard/tabs.kb';
 * runKeyboardContract(tabsKeyboardContract);
 */
export function runKeyboardContract(contract: KeyboardContract): void {
  test.describe(`APG keyboard: ${contract.component}`, () => {
    for (const c of contract.cases) {
      test(c.name, async ({ page }) => {
        await page.goto(c.url ?? contract.sandbox);
        await page.locator(c.focus).waitFor({ state: 'attached' });
        await page.locator(c.focus).focus();
        for (const k of c.prelude ?? []) {
          await page.keyboard.press(k);
        }
        await page.keyboard.press(c.press);
        for (const a of c.expect) {
          await applyAssertion(page, a);
        }
      });
    }
  });
}
