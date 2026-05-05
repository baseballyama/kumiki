/**
 * `@kumiki/machines/combobox` — pure-TS finite state machine for the Combobox.
 *
 * The Combobox is the design-validation pilot for Kumiki: complex enough to
 * exercise async race-token guarding, generic `<T>` propagation, keyboard
 * navigation, and controlled / uncontrolled input.
 *
 * **States** are intentionally flat (`idle` / `open` / `disabled`) with the
 * fine-grained "filtering vs loading vs empty" living in context flags
 * (`status: 'idle' | 'loading' | 'error'`, `filtered`, `highlightedId`). This
 * mirrors Zag.js's design and keeps the visualizer readable.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 * @see docs/components/combobox.md
 * @see docs/design/04-state-machines.md §4.4
 */

import { defineMachine, type Machine } from '@kumiki/runtime';

// ─── Public types ─────────────────────────────────────────────────────────

/**
 * Structural shape an option must satisfy. Most consumers pass typed domain
 * objects (`User`, `Product`, …) — `id` and `label` are the floor; everything
 * else propagates as `T`.
 */
export interface ComboboxOption {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/** Async fetch lifecycle. */
export type ComboboxStatus = 'idle' | 'loading' | 'error';

/** Keyboard navigation directions. */
export type NavigateDirection = 'next' | 'prev' | 'first' | 'last' | 'page-next' | 'page-prev';

/** All events the Combobox machine can receive. */
export type ComboboxEvent<T extends ComboboxOption> =
  | { type: 'INPUT.FOCUS' }
  | { type: 'INPUT.BLUR' }
  | { type: 'INPUT.CHANGE'; value: string }
  | { type: 'INPUT.ESCAPE' }
  | { type: 'INPUT.ENTER' }
  | { type: 'INPUT.NAVIGATE'; direction: NavigateDirection }
  | { type: 'OPTION.HIGHLIGHT'; id: string }
  | { type: 'OPTION.SELECT'; option: T }
  | { type: 'TRIGGER.CLICK' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  /**
   * Async fetcher resolved. Carries a `token` so a stale resolution (one
   * issued before a newer query started) is dropped on arrival.
   */
  | { type: 'FETCH.RESOLVE'; options: ReadonlyArray<T>; token: number }
  | { type: 'FETCH.REJECT'; error: Error; token: number }
  | { type: 'FETCH.LOADING'; token: number }
  /**
   * External / programmatic value update. Differs from `OPTION.SELECT` in that
   * (a) it works from any non-disabled state including `idle`, (b) it does
   * not transition state. Used by the Layer 4 component when the user binds
   * `value` and updates it from outside.
   */
  | { type: 'SET.VALUE'; value: T | null }
  | { type: 'RESET' }
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

export interface ComboboxContext<T extends ComboboxOption> {
  /** Current input string. */
  query: string;
  /** Source list of options (sync mode). For async, mirrors the latest fetch. */
  options: ReadonlyArray<T>;
  /** Filtered subset shown in the listbox. */
  filtered: ReadonlyArray<T>;
  /** Id of the currently highlighted option, or null. */
  highlightedId: string | null;
  /** Currently selected option, or null. */
  value: T | null;
  /** Async fetch lifecycle. Always 'idle' in sync mode. */
  status: ComboboxStatus;
  /** Most recent fetcher error, if any. */
  error: Error | null;
  /** Monotonic token incremented on every INPUT.CHANGE; used to drop stale fetches. */
  token: number;
  /** Page step for PageUp / PageDown navigation. */
  pageSize: number;
}

export type ComboboxState = 'idle' | 'open' | 'disabled';

export type ComboboxMachine<T extends ComboboxOption> = Machine<
  ComboboxContext<T>,
  ComboboxEvent<T>,
  ComboboxState
>;

export interface CreateComboboxInput<T extends ComboboxOption> {
  options?: ReadonlyArray<T>;
  defaultQuery?: string;
  defaultValue?: T | null;
  disabled?: boolean;
  /** Page step for PageUp/PageDown. Defaults to 10. */
  pageSize?: number;
  /**
   * Optional sync filter. Receives `(options, query)` and returns a subset.
   * Default: case-insensitive `label` substring match.
   */
  filter?: (options: ReadonlyArray<T>, query: string) => ReadonlyArray<T>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 10;

function defaultFilter<T extends ComboboxOption>(
  options: ReadonlyArray<T>,
  query: string,
): ReadonlyArray<T> {
  if (!query) return options;
  const q = query.toLowerCase();
  return options.filter((o) => o.label.toLowerCase().includes(q));
}

/** Find the next enabled option in `list` from the option whose id matches `from`. */
function navigate<T extends ComboboxOption>(
  list: ReadonlyArray<T>,
  from: string | null,
  direction: NavigateDirection,
  pageSize: number,
): string | null {
  if (list.length === 0) return null;
  const enabled = list.filter((o) => !o.disabled);
  if (enabled.length === 0) return null;

  if (direction === 'first') return enabled[0]!.id;
  if (direction === 'last') return enabled[enabled.length - 1]!.id;

  const cursor = from === null ? -1 : enabled.findIndex((o) => o.id === from);

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
  if (direction === 'next' || direction === 'prev') {
    // Arrow keys wrap (APG default).
    if (next < 0) next = enabled.length - 1;
    if (next >= enabled.length) next = 0;
  } else {
    // Page keys clamp to range.
    if (next < 0) next = 0;
    if (next >= enabled.length) next = enabled.length - 1;
  }
  return enabled[next]?.id ?? null;
}

// ─── Machine ──────────────────────────────────────────────────────────────

/**
 * Construct a fresh Combobox machine for option type `T`.
 *
 * @when-to-use The default Combobox surface. Compose `withAsyncSearch` for
 *              network-backed option fetching, `withMultiSelect` for arrays,
 *              `withVirtualization` for large lists.
 *
 * @anti-pattern Don't share a single machine across two `<input>` elements —
 *               each Combobox instance owns its machine.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */
export function createComboboxMachine<T extends ComboboxOption>(
  input: CreateComboboxInput<T> = {},
): ComboboxMachine<T> {
  const filter = input.filter ?? defaultFilter;
  const initialOptions = input.options ?? [];
  const initialQuery = input.defaultQuery ?? '';
  const initialValue = input.defaultValue ?? null;
  const disabled = input.disabled ?? false;
  const pageSize = input.pageSize ?? DEFAULT_PAGE_SIZE;
  const initialFiltered = filter(initialOptions, initialQuery);

  // Built per-instance because action closures capture `filter`.
  const factory = defineMachine<ComboboxContext<T>, ComboboxEvent<T>, ComboboxState>({
    id: 'combobox',
    initial: disabled ? 'disabled' : 'idle',
    context: {
      query: initialQuery,
      options: initialOptions,
      filtered: initialFiltered,
      highlightedId: null,
      value: initialValue,
      status: 'idle',
      error: null,
      token: 0,
      pageSize,
    },
    states: {
      idle: {
        on: {
          'INPUT.FOCUS': 'open',
          'INPUT.CHANGE': {
            target: 'open',
            actions: [
              {
                type: 'updateQuery',
                exec: (ctx, e) => {
                  if (e.type !== 'INPUT.CHANGE') return;
                  const query = e.value;
                  const filtered = filter(ctx.options, query);
                  return {
                    query,
                    filtered,
                    highlightedId: null,
                    token: ctx.token + 1,
                  };
                },
              },
            ],
          },
          'INPUT.NAVIGATE': {
            target: 'open',
            actions: [
              {
                type: 'navigateOpen',
                exec: (ctx, e) => {
                  if (e.type !== 'INPUT.NAVIGATE') return;
                  const id = navigate(
                    ctx.filtered,
                    ctx.value?.id ?? null,
                    e.direction,
                    ctx.pageSize,
                  );
                  return { highlightedId: id };
                },
              },
            ],
          },
          'TRIGGER.CLICK': 'open',
          OPEN: 'open',
          DISABLE: 'disabled',
          'SET.VALUE': {
            actions: [
              {
                type: 'setValue',
                exec: (_, e) => {
                  if (e.type !== 'SET.VALUE') return;
                  return e.value === null
                    ? { value: null, query: '' }
                    : { value: e.value, query: e.value.label };
                },
              },
            ],
          },
          RESET: {
            actions: [
              {
                type: 'reset',
                exec: (ctx) => ({
                  query: '',
                  filtered: filter(ctx.options, ''),
                  highlightedId: null,
                  value: null,
                  status: 'idle' as const,
                  error: null,
                  token: ctx.token + 1,
                }),
              },
            ],
          },
        },
      },
      open: {
        on: {
          'INPUT.BLUR': 'idle',
          'INPUT.CHANGE': {
            actions: [
              {
                type: 'updateQuery',
                exec: (ctx, e) => {
                  if (e.type !== 'INPUT.CHANGE') return;
                  const query = e.value;
                  const filtered = filter(ctx.options, query);
                  return {
                    query,
                    filtered,
                    highlightedId: null,
                    token: ctx.token + 1,
                  };
                },
              },
            ],
          },
          'INPUT.ESCAPE': {
            target: 'idle',
            actions: [{ type: 'clearHighlight', exec: () => ({ highlightedId: null }) }],
          },
          'INPUT.ENTER': {
            target: 'idle',
            cond: (ctx) => ctx.highlightedId !== null,
            actions: [
              {
                type: 'commitHighlighted',
                exec: (ctx) => {
                  const opt = ctx.filtered.find((o) => o.id === ctx.highlightedId);
                  if (!opt) return;
                  return { value: opt, query: opt.label, highlightedId: null };
                },
              },
            ],
          },
          'INPUT.NAVIGATE': {
            actions: [
              {
                type: 'navigate',
                exec: (ctx, e) => {
                  if (e.type !== 'INPUT.NAVIGATE') return;
                  const id = navigate(
                    ctx.filtered,
                    ctx.highlightedId ?? ctx.value?.id ?? null,
                    e.direction,
                    ctx.pageSize,
                  );
                  return { highlightedId: id };
                },
              },
            ],
          },
          'OPTION.HIGHLIGHT': {
            actions: [
              {
                type: 'highlight',
                exec: (_, e) => {
                  if (e.type !== 'OPTION.HIGHLIGHT') return;
                  return { highlightedId: e.id };
                },
              },
            ],
          },
          'OPTION.SELECT': {
            target: 'idle',
            actions: [
              {
                type: 'select',
                exec: (_, e) => {
                  if (e.type !== 'OPTION.SELECT') return;
                  return {
                    value: e.option,
                    query: e.option.label,
                    highlightedId: null,
                  };
                },
              },
            ],
          },
          'FETCH.LOADING': {
            actions: [
              {
                type: 'fetchLoading',
                exec: (ctx, e) => {
                  if (e.type !== 'FETCH.LOADING') return;
                  if (e.token !== ctx.token) return;
                  return { status: 'loading' as const, error: null };
                },
              },
            ],
          },
          'FETCH.RESOLVE': {
            actions: [
              {
                type: 'fetchResolve',
                exec: (ctx, e) => {
                  if (e.type !== 'FETCH.RESOLVE') return;
                  if (e.token !== ctx.token) return; // stale; drop
                  return {
                    options: e.options,
                    filtered: e.options,
                    status: 'idle' as const,
                    error: null,
                  };
                },
              },
            ],
          },
          'FETCH.REJECT': {
            actions: [
              {
                type: 'fetchReject',
                exec: (ctx, e) => {
                  if (e.type !== 'FETCH.REJECT') return;
                  if (e.token !== ctx.token) return;
                  return { status: 'error' as const, error: e.error };
                },
              },
            ],
          },
          CLOSE: {
            target: 'idle',
            actions: [{ type: 'clearHighlight', exec: () => ({ highlightedId: null }) }],
          },
          'TRIGGER.CLICK': {
            target: 'idle',
            actions: [{ type: 'clearHighlight', exec: () => ({ highlightedId: null }) }],
          },
          DISABLE: 'disabled',
          'SET.VALUE': {
            actions: [
              {
                type: 'setValue',
                exec: (_, e) => {
                  if (e.type !== 'SET.VALUE') return;
                  return e.value === null
                    ? { value: null, query: '' }
                    : { value: e.value, query: e.value.label };
                },
              },
            ],
          },
          RESET: {
            target: 'idle',
            actions: [
              {
                type: 'reset',
                exec: (ctx) => ({
                  query: '',
                  filtered: filter(ctx.options, ''),
                  highlightedId: null,
                  value: null,
                  status: 'idle' as const,
                  error: null,
                  token: ctx.token + 1,
                }),
              },
            ],
          },
        },
      },
      disabled: {
        on: {
          ENABLE: 'idle',
        },
      },
    },
  });

  return factory();
}
