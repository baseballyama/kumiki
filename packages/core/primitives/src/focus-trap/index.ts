/**
 * `@kumiki/primitives/focus-trap` — keep keyboard focus inside a container.
 *
 * What it covers:
 * - **Tab cycle**: Tab past the last focusable wraps to the first; Shift+Tab
 *   on the first wraps to the last.
 * - **Initial focus**: by default focuses the first focusable descendant on
 *   activation, but accepts a custom target.
 * - **Return focus**: on deactivation, focuses the element that was focused
 *   when activate() was called (typically the trigger button).
 *
 * What it deliberately does NOT cover:
 * - Outside-click dismissal — that's `@kumiki/primitives/dismissable`.
 * - `inert` on background siblings — Layer 3 attachments apply that for
 *   modal dialogs.
 * - Iframes, shadow DOM with `delegatesFocus`, portals — these need
 *   special-case logic that consumers can layer on top.
 *
 * @when-to-use Modal Dialog content, Combobox listbox in popup mode, Menu.
 * @anti-pattern Don't use it for inline content the user can click out of —
 *               that's `dismissable` territory.
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable=""],[contenteditable="true"]';

export type FocusTarget = HTMLElement | (() => HTMLElement | null) | null | undefined;

export interface FocusTrapOptions {
  /**
   * Element to focus on activation. Default: first focusable descendant. If
   * the container has no focusable descendant, focus stays where it is —
   * pass an explicit element if you need a guaranteed landing target.
   */
  initialFocus?: FocusTarget;
  /**
   * Element to return focus to on deactivation. Default: the element that
   * was `document.activeElement` when activate() was called. Pass `false`
   * to skip return-focus, or a specific element to override.
   */
  returnFocus?: FocusTarget | false;
}

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
  readonly active: boolean;
}

function resolve(target: FocusTarget): HTMLElement | null {
  if (target == null) return null;
  if (typeof target === 'function') return target();
  return target;
}

function focusables(root: HTMLElement): HTMLElement[] {
  const list = root.querySelectorAll<HTMLElement>(FOCUSABLE);
  const out: HTMLElement[] = [];
  for (let i = 0; i < list.length; i++) {
    const el = list[i]!;
    // Skip inert subtrees; visibility (display:none, offsetParent) is left to
    // the consumer because (a) jsdom can't reliably evaluate it, (b) real-
    // browser hidden-but-focusable cases (visibility:hidden, opacity:0) are
    // legitimate trap targets.
    if (el.closest('[inert]')) continue;
    out.push(el);
  }
  return out;
}

/**
 * Create a focus trap bound to `container`. Inert until `activate()`.
 *
 * @example
 * const trap = createFocusTrap(modalEl);
 * trap.activate();
 * // … user interaction …
 * trap.deactivate(); // focus returns to whoever opened the modal
 */
export function createFocusTrap(container: HTMLElement, options: FocusTrapOptions = {}): FocusTrap {
  let active = false;
  let returnTo: HTMLElement | null = null;

  function onKeydown(event: KeyboardEvent): void {
    if (!active || event.key !== 'Tab') return;
    const list = focusables(container);
    if (list.length === 0) return;
    const first = list[0]!;
    const last = list[list.length - 1]!;
    const current = document.activeElement as HTMLElement | null;

    if (event.shiftKey) {
      if (current === first || !container.contains(current)) {
        event.preventDefault();
        last.focus();
      }
    } else if (current === last || !container.contains(current)) {
      event.preventDefault();
      first.focus();
    }
  }

  function activate(): void {
    if (active) return;
    if (typeof document === 'undefined') return;
    active = true;

    if (options.returnFocus !== false) {
      returnTo =
        resolve(options.returnFocus as FocusTarget) ??
        (document.activeElement as HTMLElement | null);
    }

    container.addEventListener('keydown', onKeydown);

    const target = resolve(options.initialFocus) ?? focusables(container)[0];
    target?.focus();
  }

  function deactivate(): void {
    if (!active) return;
    active = false;
    container.removeEventListener('keydown', onKeydown);
    returnTo?.focus();
    returnTo = null;
  }

  return {
    activate,
    deactivate,
    get active() {
      return active;
    },
  };
}
