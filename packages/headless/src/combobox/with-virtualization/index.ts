/**
 * `@kumiki/headless/combobox/with-virtualization` — windowing layer
 * for large option lists.
 *
 * Computes the visible slice of `base.filtered` from the consumer's
 * `scrollTop` + `viewportHeight`. The math is intentionally tiny —
 * fixed-row-height windowing is a few lines, and dragging in
 * `@tanstack/virtual-core` would blow past the bundle budget.
 *
 * The consumer wires their own scrollable container:
 *
 *   - On the listbox `<ul>`, set `style="height: <total>px; position: relative"`.
 *   - On the listbox `<scroll-parent>`, listen for `scroll` and call
 *     `controller.setScrollTop(target.scrollTop)`.
 *   - When the parent's height changes (resize observer / mount), call
 *     `controller.setViewportHeight(...)`.
 *   - Render `controller.visibleItems` and apply `controller.getItemStyle(index)`
 *     to each — it returns absolute-positioned top + height in px.
 *
 * Variable row heights are out of scope here. For that, ship a follow-up
 * `withDynamicVirtualization` ADR'd against an off-the-shelf measurer.
 *
 * @see ../../../../../docs/design/11-composition.md §11.4
 */

import type { Attachment, ComboboxController } from '../index.js';
import type { ComboboxOption } from '@kumiki/machines/combobox';

export interface VirtualizationOptions {
  /** Pixel height of every option row. Required — fixed for now. */
  readonly itemHeight: number;
  /** Extra rows rendered above + below the visible window. Default 4. */
  readonly overscan?: number;
}

export interface VirtualItem<T extends ComboboxOption> {
  readonly index: number;
  readonly option: T;
}

export interface ItemStyle {
  readonly position: 'absolute';
  readonly top: number;
  readonly left: 0;
  readonly right: 0;
  readonly height: number;
}

export interface VirtualizationSnapshot<T extends ComboboxOption> {
  readonly visibleItems: ReadonlyArray<VirtualItem<T>>;
  readonly totalHeight: number;
  readonly start: number;
  readonly end: number;
}

export interface VirtualizedCombobox<T extends ComboboxOption> extends ComboboxController<T> {
  readonly visibleItems: ReadonlyArray<VirtualItem<T>>;
  readonly totalHeight: number;
  /** Inclusive start index of the rendered window. */
  readonly windowStart: number;
  /** Exclusive end index of the rendered window. */
  readonly windowEnd: number;

  setScrollTop(value: number): void;
  setViewportHeight(value: number): void;

  getItemStyle(index: number): ItemStyle;

  /**
   * Option attachment that, on top of the base wiring, sets `aria-setsize` to
   * the full filtered length and `aria-posinset` to `item`'s 1-based index in
   * the full filtered list. Without these, a screen reader windowing only a
   * few DOM nodes announces "N of <visible>" instead of "N of <total>".
   *
   * `posInSet` / `setSize` may be passed explicitly (e.g. from a
   * `VirtualItem.index`); when omitted they are derived from `base.filtered`.
   */
  option(item: T, posInSet?: number, setSize?: number): Attachment;

  subscribeVirtualization(listener: (snapshot: VirtualizationSnapshot<T>) => void): () => void;

  /** Tear down the base subscription this wrapper holds. */
  destroy(): void;
}

/**
 * Wrap a Combobox controller with fixed-row-height windowing.
 *
 * @when-to-use Lists with hundreds-to-thousands of options where
 *              rendering every `<li>` would tank scroll perf.
 *
 * @anti-pattern Don't compose this for short lists — the windowing
 *               math overhead and absolute-positioning cost more than
 *               just rendering everything.
 */
export function withVirtualization<T extends ComboboxOption>(
  base: ComboboxController<T>,
  options: VirtualizationOptions,
): VirtualizedCombobox<T> {
  if (options.itemHeight <= 0 || !Number.isFinite(options.itemHeight)) {
    throw new RangeError('itemHeight must be a positive finite number');
  }
  const itemHeight = options.itemHeight;
  const overscan = Math.max(0, options.overscan ?? 4);

  let scrollTop = 0;
  let viewportHeight = 0;
  let cached: VirtualizationSnapshot<T> | null = null;
  const listeners = new Set<(snap: VirtualizationSnapshot<T>) => void>();

  function compute(): VirtualizationSnapshot<T> {
    const items = base.filtered;
    const total = items.length;
    const totalHeight = total * itemHeight;
    if (total === 0 || viewportHeight === 0) {
      return { visibleItems: [], totalHeight, start: 0, end: 0 };
    }
    const rawStart = Math.floor(scrollTop / itemHeight);
    const rawEnd = Math.ceil((scrollTop + viewportHeight) / itemHeight);
    const start = Math.max(0, rawStart - overscan);
    const end = Math.min(total, rawEnd + overscan);
    const slice: VirtualItem<T>[] = [];
    for (let i = start; i < end; i++) {
      const opt = items[i];
      if (opt) slice.push({ index: i, option: opt });
    }
    return { visibleItems: slice, totalHeight, start, end };
  }

  function recompute(): void {
    cached = compute();
    const snap = cached;
    for (const listener of listeners) listener(snap);
  }

  function snapshot(): VirtualizationSnapshot<T> {
    if (cached === null) cached = compute();
    return cached;
  }

  // Re-window whenever the filtered list changes (machine subscribe).
  let prevFiltered = base.filtered;
  const unsubscribe = base.subscribe(({ context }) => {
    if (context.filtered !== prevFiltered) {
      prevFiltered = context.filtered;
      recompute();
    }
  });

  function setScrollTop(value: number): void {
    if (value === scrollTop) return;
    scrollTop = Math.max(0, value);
    recompute();
  }

  function setViewportHeight(value: number): void {
    if (value === viewportHeight) return;
    viewportHeight = Math.max(0, value);
    recompute();
  }

  function getItemStyle(index: number): ItemStyle {
    return {
      position: 'absolute',
      top: index * itemHeight,
      left: 0,
      right: 0,
      height: itemHeight,
    };
  }

  // Compose the base option attachment, then set aria-setsize/aria-posinset
  // against the FULL filtered list so SR announcements read "N of <total>"
  // even when only a window of rows is in the DOM. Re-applied on filter change
  // since an item's position in the full list can shift.
  function option(item: T, posInSet?: number, setSize?: number): Attachment {
    const baseOption = base.option(item);
    return (node) => {
      const baseTeardown = baseOption(node);
      const apply = (): void => {
        const filtered = base.filtered;
        const total = setSize ?? filtered.length;
        const pos = posInSet ?? filtered.findIndex((o) => o.id === item.id) + 1;
        node.setAttribute('aria-setsize', String(total));
        if (pos > 0) node.setAttribute('aria-posinset', String(pos));
        else node.removeAttribute('aria-posinset');
      };
      apply();
      const off = base.subscribe(apply);
      return () => {
        off();
        baseTeardown?.();
      };
    };
  }

  const wrapped: VirtualizedCombobox<T> = Object.create(base, {
    visibleItems: { get: () => snapshot().visibleItems, enumerable: true },
    totalHeight: { get: () => snapshot().totalHeight, enumerable: true },
    windowStart: { get: () => snapshot().start, enumerable: true },
    windowEnd: { get: () => snapshot().end, enumerable: true },
    setScrollTop: { value: setScrollTop, enumerable: true },
    setViewportHeight: { value: setViewportHeight, enumerable: true },
    getItemStyle: { value: getItemStyle, enumerable: true },
    option: { value: option, enumerable: true },
    subscribeVirtualization: {
      value: (listener: (snap: VirtualizationSnapshot<T>) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      enumerable: true,
    },
    destroy: { value: () => unsubscribe(), enumerable: true },
  }) as VirtualizedCombobox<T>;

  return wrapped;
}
