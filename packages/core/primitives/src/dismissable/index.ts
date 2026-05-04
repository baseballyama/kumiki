/**
 * `@kumiki/primitives/dismissable` — outside-click + Escape signal handlers.
 *
 * The primitive does not close anything itself — it just calls back. The
 * consumer wires `onOutsideClick` and `onEscape` to whatever state mutation
 * is appropriate (`controller.close()`, `dispatch({ type: 'CLOSE' })`, etc.).
 *
 * "Outside" is defined as: not inside `container`, and not inside any element
 * listed in `ignore`. The ignore list covers cases where a related element
 * lives outside the container's DOM subtree (e.g. a popover whose trigger is
 * visually adjacent but not a descendant).
 *
 * Pointer events: we listen on `pointerdown` because it fires before focus
 * shifts and works consistently across mouse, touch, and pen. Listening on
 * `click` would miss cases where the user mousedowns inside and mouseups
 * outside, and `mousedown` ignores touch.
 *
 * @when-to-use Modal Dialog overlay, Combobox listbox in popup mode, Menu,
 *              Tooltip in click mode, Popover.
 * @anti-pattern Don't compose with `focus-trap` for non-modal popovers — the
 *               trap defeats outside-click dismissal. Pick one.
 */

export type ElementTarget = HTMLElement | (() => HTMLElement | null) | null | undefined;

export interface DismissableOptions {
  /** Called when a pointerdown occurs outside the container + ignore list. */
  onOutsideClick?: (event: Event) => void;
  /** Called when Escape is pressed while active. */
  onEscape?: (event: KeyboardEvent) => void;
  /**
   * Elements outside `container` that should NOT count as "outside". Each
   * may be an element or a thunk that resolves at call time (so consumers
   * can pass a ref that may not yet be mounted at activate()).
   */
  ignore?: ReadonlyArray<ElementTarget>;
}

export interface Dismissable {
  activate(): void;
  deactivate(): void;
  readonly active: boolean;
}

function resolve(t: ElementTarget): HTMLElement | null {
  if (t == null) return null;
  return typeof t === 'function' ? t() : t;
}

/**
 * Create a dismissable handler bound to `container`. Inert until `activate()`.
 *
 * @example
 * const d = createDismissable(panel, {
 *   onOutsideClick: () => controller.close(),
 *   onEscape: () => controller.close(),
 * });
 * d.activate();
 */
export function createDismissable(
  container: HTMLElement,
  options: DismissableOptions = {},
): Dismissable {
  let active = false;

  function isInside(target: EventTarget | null): boolean {
    if (!(target instanceof Node)) return false;
    if (container.contains(target)) return true;
    const list = options.ignore;
    if (!list) return false;
    for (let i = 0; i < list.length; i++) {
      const el = resolve(list[i]);
      if (el && el.contains(target)) return true;
    }
    return false;
  }

  function onPointerDown(event: Event): void {
    if (!active) return;
    if (isInside(event.target)) return;
    options.onOutsideClick?.(event);
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!active || event.key !== 'Escape') return;
    options.onEscape?.(event);
  }

  function activate(): void {
    if (active) return;
    if (typeof document === 'undefined') return;
    active = true;
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeydown);
  }

  function deactivate(): void {
    if (!active) return;
    active = false;
    document.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('keydown', onKeydown);
  }

  return {
    activate,
    deactivate,
    get active() {
      return active;
    },
  };
}
