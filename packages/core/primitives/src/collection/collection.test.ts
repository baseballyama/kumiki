import { describe, it, expect } from 'vitest';
import { findByTypeAhead, getNextEnabledId, tabindexFor } from './index.ts';

const items = [
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana', disabled: true },
  { id: 'c', label: 'Cherry' },
  { id: 'd', label: 'Date' },
  { id: 'e', label: 'Elderberry' },
];

describe('getNextEnabledId', () => {
  it('first / last skip disabled', () => {
    expect(getNextEnabledId(items, null, 'first')).toBe('a');
    expect(getNextEnabledId(items, null, 'last')).toBe('e');
  });

  it('next from null lands on first enabled', () => {
    expect(getNextEnabledId(items, null, 'next')).toBe('a');
  });

  it('next skips disabled', () => {
    expect(getNextEnabledId(items, 'a', 'next')).toBe('c');
  });

  it('prev skips disabled', () => {
    expect(getNextEnabledId(items, 'c', 'prev')).toBe('a');
  });

  it('wrap mode (default): next from last → first', () => {
    expect(getNextEnabledId(items, 'e', 'next')).toBe('a');
  });

  it('wrap mode: prev from first → last', () => {
    expect(getNextEnabledId(items, 'a', 'prev')).toBe('e');
  });

  it('clamp mode stays at boundary', () => {
    expect(getNextEnabledId(items, 'e', 'next', { mode: 'clamp' })).toBe('e');
    expect(getNextEnabledId(items, 'a', 'prev', { mode: 'clamp' })).toBe('a');
  });

  it('page-next / page-prev clamp to range', () => {
    expect(getNextEnabledId(items, 'a', 'page-next', { pageSize: 2 })).toBe('d');
    expect(getNextEnabledId(items, 'e', 'page-next', { pageSize: 2 })).toBe('e');
    expect(getNextEnabledId(items, 'd', 'page-prev', { pageSize: 2 })).toBe('a');
  });

  it('empty list returns null', () => {
    expect(getNextEnabledId([], null, 'next')).toBe(null);
  });

  it('all-disabled list returns null', () => {
    expect(getNextEnabledId([{ id: 'x', disabled: true }], null, 'first')).toBe(null);
  });

  it('unknown fromId is treated as before-first', () => {
    expect(getNextEnabledId(items, 'unknown', 'next')).toBe('a');
  });
});

describe('findByTypeAhead', () => {
  it('finds the first match by label prefix', () => {
    expect(findByTypeAhead(items, 'c')).toBe('c');
  });

  it('case-insensitive', () => {
    expect(findByTypeAhead(items, 'CHE')).toBe('c');
  });

  it('cycles to next match starting after fromId', () => {
    // Both "Cherry" and "Date" don't share a prefix; but if we test "e":
    // "Elderberry" matches once; from 'e', should find no other "e" match → null.
    // Use a richer fixture where two items share a prefix:
    const items2 = [
      { id: '1', label: 'Apple' },
      { id: '2', label: 'Apricot' },
      { id: '3', label: 'Banana' },
    ];
    expect(findByTypeAhead(items2, 'a', null)).toBe('1');
    expect(findByTypeAhead(items2, 'a', '1')).toBe('2');
    expect(findByTypeAhead(items2, 'a', '2')).toBe('1'); // wraps
  });

  it('skips disabled items', () => {
    expect(findByTypeAhead(items, 'b')).toBe(null); // banana is disabled
  });

  it('returns null when no match', () => {
    expect(findByTypeAhead(items, 'z')).toBe(null);
  });

  it('returns null on empty query', () => {
    expect(findByTypeAhead(items, '')).toBe(null);
  });
});

describe('tabindexFor', () => {
  it('focused item gets 0', () => {
    expect(tabindexFor(items, 'c', 'c')).toBe(0);
  });

  it('non-focused item gets -1', () => {
    expect(tabindexFor(items, 'a', 'c')).toBe(-1);
  });

  it('default (no focused): first enabled item gets 0', () => {
    expect(tabindexFor(items, 'a', null)).toBe(0);
    expect(tabindexFor(items, 'b', null)).toBe(-1);
    expect(tabindexFor(items, 'c', null)).toBe(-1);
  });
});
