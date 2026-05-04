/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCombobox } from '../index.js';
import { withAsyncSearch, type AsyncFetcher } from './index.js';

interface City {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

const ALL_CITIES: City[] = [
  { id: 'tk', value: 'tk', label: 'Tokyo' },
  { id: 'os', value: 'os', label: 'Osaka' },
  { id: 'ny', value: 'ny', label: 'New York' },
  { id: 'sf', value: 'sf', label: 'San Francisco' },
  { id: 'ldn', value: 'ldn', label: 'London' },
];

function makeFetcher(latencyMs: number, options?: { abortable?: boolean }) {
  const abortable = options?.abortable ?? true;
  const fetcher: AsyncFetcher<City> = (query, signal) =>
    new Promise<ReadonlyArray<City>>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (signal.aborted) {
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
          return;
        }
        const q = query.toLowerCase();
        resolve(ALL_CITIES.filter((c) => c.label.toLowerCase().includes(q)));
      }, latencyMs);
      if (abortable) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
        });
      }
    });
  return fetcher;
}

function newCb(initialOptions: ReadonlyArray<City> = []) {
  return createCombobox<City>({ options: initialOptions });
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('withAsyncSearch', () => {
  it('initial state surfaces base status', () => {
    const cb = withAsyncSearch(newCb(), makeFetcher(0));
    expect(cb.status).toBe('idle');
    expect(cb.error).toBeNull();
  });

  it('typing fires the fetcher and replaces the option list', async () => {
    const base = newCb();
    const cb = withAsyncSearch(base, makeFetcher(50));
    base.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    expect(cb.status).toBe('loading');
    await vi.advanceTimersByTimeAsync(60);
    expect(cb.status).toBe('idle');
    expect(cb.context.options.map((o) => o.id)).toEqual(['tk']);
    expect(cb.filtered.map((o) => o.id)).toEqual(['tk']);
  });

  it('an empty query short-circuits to empty results without calling the fetcher', async () => {
    const base = newCb([{ id: 'x', value: 'x', label: 'X' }]);
    const fetcher = vi.fn(makeFetcher(20));
    const cb = withAsyncSearch(base, fetcher);
    base.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    await vi.advanceTimersByTimeAsync(30);
    base.machine.send({ type: 'INPUT.CHANGE', value: '' });
    await vi.advanceTimersByTimeAsync(30);
    // First call only — second (empty) should not have hit the fetcher.
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(cb.filtered).toEqual([]);
  });

  it('fetchOnEmpty=true triggers the fetcher even on empty', async () => {
    const fetcher = vi.fn(makeFetcher(20));
    const cb = withAsyncSearch(newCb(), fetcher, { fetchOnEmpty: true });
    cb.machine.send({ type: 'INPUT.CHANGE', value: '' });
    await vi.advanceTimersByTimeAsync(30);
    expect(fetcher).toHaveBeenCalled();
  });

  it('a newer query aborts the in-flight fetch and the older result is dropped', async () => {
    const base = newCb();
    const cb = withAsyncSearch(base, makeFetcher(100));
    base.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    expect(cb.status).toBe('loading');
    // Immediately type a new query before the first resolves.
    base.machine.send({ type: 'INPUT.CHANGE', value: 'lo' });
    await vi.advanceTimersByTimeAsync(150);
    expect(cb.context.options.map((o) => o.id)).toEqual(['ldn']);
  });

  it('fetcher rejection (non-abort) sets status=error', async () => {
    const failing: AsyncFetcher<City> = () =>
      new Promise((_, reject) => setTimeout(() => reject(new Error('500')), 30));
    const cb = withAsyncSearch(newCb(), failing);
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    await vi.advanceTimersByTimeAsync(40);
    expect(cb.status).toBe('error');
    expect(cb.error?.message).toBe('500');
  });

  it('aborts do not flip status to error', async () => {
    const cb = withAsyncSearch(newCb(), makeFetcher(100));
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'os' });
    await vi.advanceTimersByTimeAsync(150);
    expect(cb.status).toBe('idle');
    expect(cb.context.options.map((o) => o.id)).toEqual(['os']);
  });

  it('base methods still work through the wrapper', () => {
    const cb = withAsyncSearch(newCb(), makeFetcher(0));
    cb.open();
    expect(cb.isOpen).toBe(true);
    cb.close();
    expect(cb.isOpen).toBe(false);
  });

  it('debounceMs delays the fetch', async () => {
    const fetcher = vi.fn(makeFetcher(0));
    const cb = withAsyncSearch(newCb(), fetcher, { debounceMs: 200 });
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    await vi.advanceTimersByTimeAsync(100);
    expect(fetcher).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(150);
    expect(fetcher).toHaveBeenCalled();
  });

  it('debounce coalesces rapid keystrokes — only the last query is fetched', async () => {
    const fetcher = vi.fn(makeFetcher(0));
    const cb = withAsyncSearch(newCb(), fetcher, { debounceMs: 200 });
    cb.machine.send({ type: 'INPUT.CHANGE', value: 't' });
    await vi.advanceTimersByTimeAsync(50);
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    await vi.advanceTimersByTimeAsync(50);
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'tok' });
    await vi.advanceTimersByTimeAsync(250);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0]?.[0]).toBe('tok');
  });

  it('error state recovers on the next successful query', async () => {
    let shouldFail = true;
    const fetcher: AsyncFetcher<City> = (query) =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) reject(new Error('boom'));
          else resolve(ALL_CITIES.filter((c) => c.label.toLowerCase().includes(query)));
        }, 20);
      });
    const cb = withAsyncSearch(newCb(), fetcher);
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    await vi.advanceTimersByTimeAsync(30);
    expect(cb.status).toBe('error');
    shouldFail = false;
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'lo' });
    await vi.advanceTimersByTimeAsync(30);
    expect(cb.status).toBe('idle');
    expect(cb.error).toBeNull();
  });

  it('signal.aborted is true after a newer query supersedes it', async () => {
    let firstSignal: AbortSignal | null = null;
    const fetcher: AsyncFetcher<City> = (_query, signal) => {
      if (firstSignal === null) firstSignal = signal;
      return new Promise((resolve) => setTimeout(() => resolve([]), 100));
    };
    const cb = withAsyncSearch(newCb(), fetcher);
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'to' });
    cb.machine.send({ type: 'INPUT.CHANGE', value: 'lo' });
    await vi.advanceTimersByTimeAsync(150);
    expect(firstSignal?.aborted).toBe(true);
  });
});
