/**
 * `@kumiki/primitives/collection` — pure-data helpers for ordered collections
 * with focus / selection navigation.
 *
 * Used by Combobox, Listbox, Menu, RadioGroup, Tabs — anywhere arrow keys
 * move a cursor across a list of items. Disabled items are skipped (per
 * WAI-ARIA APG: "Disabled menu items are not focusable").
 *
 * Pure TypeScript. No DOM. Layer 3 attachments wrap these helpers and apply
 * the result via `tabindex` / `aria-activedescendant` / `focus()`.
 */

/** The minimal shape an item must satisfy. */
export interface CollectionItem {
  readonly id: string;
  readonly disabled?: boolean;
  readonly label?: string;
}

/** Direction for keyboard navigation. */
export type NavigateDirection = 'next' | 'prev' | 'first' | 'last' | 'page-next' | 'page-prev';

export interface NavigateOptions {
  /**
   * `wrap` (default) — `next`/`prev` wraps from end → start. APG default for
   * vertical Listboxes / Combobox.
   * `clamp` — stop at the boundaries. APG default for Tabs.
   */
  readonly mode?: 'wrap' | 'clamp';
  /** Page step for `page-next` / `page-prev`. Defaults to 10. */
  readonly pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Find the id of the next enabled item from `fromId` in `direction`.
 * Returns `null` if the collection has no enabled items.
 *
 * @example
 * getNextEnabledId(
 *   [{ id: 'a' }, { id: 'b', disabled: true }, { id: 'c' }],
 *   'a',
 *   'next',
 * ); // → 'c'
 *
 * @when-to-use Inside a state machine's transition action, where you need a
 *              pure function to compute the next focused item from current
 *              context.
 */
export function getNextEnabledId<T extends CollectionItem>(
  items: ReadonlyArray<T>,
  fromId: string | null,
  direction: NavigateDirection,
  options: NavigateOptions = {},
): string | null {
  if (items.length === 0) return null;
  const enabled = items.filter((it) => !it.disabled);
  if (enabled.length === 0) return null;

  const mode = options.mode ?? 'wrap';
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;

  if (direction === 'first') return enabled[0]!.id;
  if (direction === 'last') return enabled[enabled.length - 1]!.id;

  const cursor = fromId === null ? -1 : enabled.findIndex((it) => it.id === fromId);

  const step =
    direction === 'next'
      ? 1
      : direction === 'prev'
        ? -1
        : direction === 'page-next'
          ? pageSize
          : direction === 'page-prev'
            ? -pageSize
            : 0;

  let next = cursor + step;

  if (mode === 'wrap' && (direction === 'next' || direction === 'prev')) {
    if (next < 0) next = enabled.length - 1;
    if (next >= enabled.length) next = 0;
  } else {
    if (next < 0) next = 0;
    if (next >= enabled.length) next = enabled.length - 1;
  }
  return enabled[next]?.id ?? null;
}

/**
 * Type-ahead match: find the next item whose `label` starts with `query`,
 * starting after `fromId` and wrapping.
 *
 * @when-to-use Listbox / Menu with letter-jump (the user types "C" to jump
 *              to the first item starting with C).
 *
 * Comparison is case-insensitive. Items without a `label` are skipped — type-
 * ahead is for human-readable labels, not internal ids.
 */
export function findByTypeAhead<T extends CollectionItem>(
  items: ReadonlyArray<T>,
  query: string,
  fromId: string | null = null,
): string | null {
  if (items.length === 0 || query.length === 0) return null;
  const q = query.toLowerCase();

  const enabled = items.filter((it) => !it.disabled && it.label !== undefined);
  if (enabled.length === 0) return null;

  // Start one past the current position so a matching first character cycles
  // to the next match instead of re-selecting the current item.
  const startIdx = fromId === null ? 0 : enabled.findIndex((it) => it.id === fromId) + 1;
  const len = enabled.length;
  for (let i = 0; i < len; i++) {
    const idx = (startIdx + i) % len;
    const item = enabled[idx]!;
    if (item.label!.toLowerCase().startsWith(q)) {
      return item.id;
    }
  }
  return null;
}

/**
 * Compute the `tabindex` value for an item under roving-tabindex semantics:
 * only the focused (or first enabled, if none focused) item gets `0`; every
 * other item gets `-1`.
 *
 * @when-to-use Inside a Layer 3 attachment that paints `tabindex` on each
 *              item element.
 */
export function tabindexFor<T extends CollectionItem>(
  items: ReadonlyArray<T>,
  itemId: string,
  focusedId: string | null,
): 0 | -1 {
  if (focusedId !== null) {
    return itemId === focusedId ? 0 : -1;
  }
  const firstEnabled = items.find((it) => !it.disabled);
  return firstEnabled?.id === itemId ? 0 : -1;
}
