import { describe, it, expect } from 'vitest';
import { calculatePages } from './index.ts';

describe('calculatePages', () => {
  it('returns empty for zero pages', () => {
    expect(calculatePages({ page: 1, pageCount: 0 })).toEqual([]);
  });

  it('renders all pages when pageCount fits without ellipses', () => {
    const items = calculatePages({ page: 3, pageCount: 5 });
    expect(items.map((i) => (i.type === 'page' ? i.page : '…'))).toEqual([1, 2, 3, 4, 5]);
    const current = items.find((i) => i.type === 'page' && i.isCurrent);
    expect(current && current.type === 'page' && current.page).toBe(3);
  });

  it('inserts a leading ellipsis when current page is far from start', () => {
    const items = calculatePages({ page: 9, pageCount: 12 });
    const tokens = items.map((i) => (i.type === 'page' ? i.page : `…${i.side}`));
    expect(tokens[0]).toBe(1);
    expect(tokens).toContain('…start');
    expect(tokens[tokens.length - 1]).toBe(12);
  });

  it('inserts a trailing ellipsis when current page is far from end', () => {
    const items = calculatePages({ page: 3, pageCount: 12 });
    const tokens = items.map((i) => (i.type === 'page' ? i.page : `…${i.side}`));
    expect(tokens[0]).toBe(1);
    expect(tokens).toContain('…end');
    expect(tokens[tokens.length - 1]).toBe(12);
  });

  it('inserts both ellipses when current page is in the middle', () => {
    const items = calculatePages({ page: 7, pageCount: 14 });
    const sides = items.filter((i) => i.type === 'ellipsis').map((i) => i.side);
    expect(sides).toEqual(['start', 'end']);
  });

  it('respects siblingCount', () => {
    const items = calculatePages({ page: 7, pageCount: 14, siblingCount: 2 });
    const pages = items.filter((i) => i.type === 'page').map((i) => i.page);
    // Should include 5,6,7,8,9 around current.
    for (const n of [5, 6, 7, 8, 9]) expect(pages).toContain(n);
  });

  it('respects boundaryCount', () => {
    const items = calculatePages({ page: 10, pageCount: 20, boundaryCount: 2 });
    const pages = items.filter((i) => i.type === 'page').map((i) => i.page);
    // First and last 2 always shown.
    for (const n of [1, 2, 19, 20]) expect(pages).toContain(n);
  });

  it('does not duplicate boundary pages adjacent to the window', () => {
    const items = calculatePages({ page: 3, pageCount: 6 });
    const pages = items.filter((i) => i.type === 'page').map((i) => i.page);
    // Each page appears once.
    expect(new Set(pages).size).toBe(pages.length);
  });

  it('marks the current page', () => {
    const items = calculatePages({ page: 5, pageCount: 10 });
    const current = items.find((i) => i.type === 'page' && i.isCurrent);
    expect(current && current.type === 'page' && current.page).toBe(5);
  });
});
