/**
 * `@kumiki/headless/combobox/with-async-search` — replaces sync
 * filtering with an abort-aware async fetcher.
 *
 * On every query change, the wrapper:
 *   1. Aborts the prior in-flight fetch via its `AbortController`.
 *   2. Dispatches `FETCH.LOADING` with the machine's current token.
 *   3. Calls the user's `fetcher(query, signal)`.
 *   4. On success: `FETCH.RESOLVE` with the returned options + token.
 *   5. On failure (non-abort): `FETCH.REJECT` with the error + token.
 *
 * The machine's reducers compare `event.token` to `ctx.token` and drop
 * stale events. Each `INPUT.CHANGE` bumps the token, so a quickly-typed
 * sequence of queries naturally invalidates earlier fetches.
 *
 * Aborted fetches surface as `DOMException` / `AbortError`; we swallow
 * those without dispatching REJECT — they're the expected outcome of a
 * superseded query.
 *
 * @see ../../../../../docs/design/11-composition.md §11.4
 * @see ../../../../../docs/design/04-state-machines.md §4.4
 */

import type { ComboboxController } from '../index.js';
import type { ComboboxOption, ComboboxStatus } from '@kumiki/machines/combobox';

export type AsyncFetcher<T extends ComboboxOption> = (
  query: string,
  signal: AbortSignal,
) => Promise<ReadonlyArray<T>>;

export interface AsyncSearchOptions {
  /**
   * If true, an empty query also triggers the fetcher (with empty string).
   * Default false — empty query short-circuits to an empty list without
   * touching the network.
   */
  readonly fetchOnEmpty?: boolean;
  /**
   * Debounce in ms applied between query change and fetch start. Default 0.
   * Race-token guarding makes debounce optional but reduces wasted requests.
   */
  readonly debounceMs?: number;
}

export interface AsyncSearchCombobox<T extends ComboboxOption> extends ComboboxController<T> {
  readonly status: ComboboxStatus;
  readonly error: Error | null;
}

function isAbortError(e: unknown): boolean {
  if (e === null || typeof e !== 'object') return false;
  const name = (e as { name?: unknown }).name;
  return name === 'AbortError';
}

/**
 * Wrap a Combobox controller with async option fetching.
 *
 * @when-to-use Large or remote option sets where filtering happens on the
 *              server (search APIs, autocomplete-from-DB, locale-aware
 *              dictionaries).
 *
 * @anti-pattern Don't compose this when the option set fits in memory and
 *               the consumer already has it loaded — the base controller's
 *               sync filter is faster and cheaper.
 */
export function withAsyncSearch<T extends ComboboxOption>(
  base: ComboboxController<T>,
  fetcher: AsyncFetcher<T>,
  options: AsyncSearchOptions = {},
): AsyncSearchCombobox<T> {
  const fetchOnEmpty = options.fetchOnEmpty ?? false;
  const debounceMs = options.debounceMs ?? 0;

  let activeController: AbortController | null = null;
  let debounceHandle: ReturnType<typeof setTimeout> | null = null;
  let prevQuery = base.query;
  let prevToken = base.context.token;

  function clearDebounce(): void {
    if (debounceHandle !== null) {
      clearTimeout(debounceHandle);
      debounceHandle = null;
    }
  }

  function abortInFlight(): void {
    if (activeController !== null) {
      activeController.abort();
      activeController = null;
    }
  }

  async function runFetch(query: string, token: number): Promise<void> {
    abortInFlight();
    const controller = new AbortController();
    activeController = controller;
    base.machine.send({ type: 'FETCH.LOADING', token });
    try {
      const list = await fetcher(query, controller.signal);
      if (controller.signal.aborted) return;
      base.machine.send({ type: 'FETCH.RESOLVE', options: list, token });
    } catch (e) {
      if (controller.signal.aborted || isAbortError(e)) return;
      const error = e instanceof Error ? e : new Error(String(e));
      base.machine.send({ type: 'FETCH.REJECT', error, token });
    } finally {
      if (activeController === controller) activeController = null;
    }
  }

  function scheduleFetch(query: string, token: number): void {
    clearDebounce();
    if (debounceMs <= 0) {
      void runFetch(query, token);
      return;
    }
    debounceHandle = setTimeout(() => {
      debounceHandle = null;
      void runFetch(query, token);
    }, debounceMs);
  }

  base.subscribe(({ context }) => {
    const nextToken = context.token;
    const nextQuery = context.query;
    if (nextToken === prevToken && nextQuery === prevQuery) return;
    prevToken = nextToken;
    prevQuery = nextQuery;
    if (!fetchOnEmpty && nextQuery === '') {
      // Cancel any in-flight request and reset to empty silently.
      abortInFlight();
      clearDebounce();
      base.machine.send({ type: 'FETCH.RESOLVE', options: [], token: nextToken });
      return;
    }
    scheduleFetch(nextQuery, nextToken);
  });

  const wrapped: AsyncSearchCombobox<T> = Object.create(base, {
    status: { get: () => base.status, enumerable: true },
    error: { get: () => base.context.error ?? null, enumerable: true },
  }) as AsyncSearchCombobox<T>;

  return wrapped;
}
