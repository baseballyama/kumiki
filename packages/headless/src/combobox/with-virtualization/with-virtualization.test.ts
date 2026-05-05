/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest';
import { createCombobox } from '../index.js';
import { withVirtualization } from './index.js';

interface City {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

function makeCities(count: number): City[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `c${i}`,
    value: `c${i}`,
    label: `City ${i}`,
  }));
}

function newCb(count: number) {
  return createCombobox<City>({ options: makeCities(count) });
}

describe('withVirtualization', () => {
  it('throws on non-positive itemHeight', () => {
    const base = newCb(10);
    expect(() => withVirtualization(base, { itemHeight: 0 })).toThrow(RangeError);
    expect(() => withVirtualization(base, { itemHeight: -10 })).toThrow(RangeError);
    expect(() => withVirtualization(base, { itemHeight: NaN })).toThrow(RangeError);
  });

  it('initial visibleItems is empty until viewportHeight is set', () => {
    const cb = withVirtualization(newCb(100), { itemHeight: 32 });
    expect(cb.visibleItems).toEqual([]);
    expect(cb.totalHeight).toBe(100 * 32);
  });

  it('totalHeight = filtered.length * itemHeight', () => {
    const cb = withVirtualization(newCb(50), { itemHeight: 24 });
    expect(cb.totalHeight).toBe(50 * 24);
  });

  it('computes the visible window from scrollTop + viewportHeight', () => {
    const cb = withVirtualization(newCb(100), { itemHeight: 32, overscan: 0 });
    cb.setViewportHeight(96);
    cb.setScrollTop(0);
    expect(cb.visibleItems.map((v) => v.index)).toEqual([0, 1, 2]);
    cb.setScrollTop(100); // floor(100/32)=3 .. ceil((100+96)/32)=ceil(6.125)=7
    expect(cb.visibleItems.map((v) => v.index)).toEqual([3, 4, 5, 6]);
  });

  it('overscan extends the window above and below', () => {
    const cb = withVirtualization(newCb(100), { itemHeight: 32, overscan: 2 });
    cb.setViewportHeight(96);
    cb.setScrollTop(160); // raw [5..8); overscan=2 → [3..10) (end exclusive)
    const indices = cb.visibleItems.map((v) => v.index);
    expect(indices[0]).toBe(3);
    expect(indices[indices.length - 1]).toBe(9);
    expect(cb.windowEnd).toBe(10);
  });

  it('clamps the window to [0, length)', () => {
    const cb = withVirtualization(newCb(20), { itemHeight: 32, overscan: 4 });
    cb.setViewportHeight(96);
    // Scroll inside content's last viewport-worth.
    const lastReasonableScroll = Math.max(0, 20 * 32 - 96);
    cb.setScrollTop(lastReasonableScroll);
    expect(cb.windowEnd).toBe(20);
    expect(cb.visibleItems[cb.visibleItems.length - 1]?.index).toBe(19);
    // Scroll before the start clamps to 0.
    cb.setScrollTop(-100);
    expect(cb.windowStart).toBe(0);
  });

  it('getItemStyle returns absolute positioning anchored to itemHeight', () => {
    const cb = withVirtualization(newCb(10), { itemHeight: 40 });
    expect(cb.getItemStyle(0)).toEqual({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 40,
    });
    expect(cb.getItemStyle(5)).toMatchObject({ top: 200, height: 40 });
  });

  it('subscribeVirtualization fires on scroll change', () => {
    const cb = withVirtualization(newCb(100), { itemHeight: 32 });
    cb.setViewportHeight(96);
    const fn = vi.fn();
    const unsub = cb.subscribeVirtualization(fn);
    cb.setScrollTop(64);
    cb.setScrollTop(128);
    expect(fn).toHaveBeenCalledTimes(2);
    unsub();
  });

  it('setScrollTop is a no-op when value is unchanged', () => {
    const cb = withVirtualization(newCb(100), { itemHeight: 32 });
    cb.setViewportHeight(96);
    cb.setScrollTop(100);
    const fn = vi.fn();
    cb.subscribeVirtualization(fn);
    cb.setScrollTop(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('re-windows when filtered list changes (typed query)', () => {
    const base = newCb(100);
    const cb = withVirtualization(base, { itemHeight: 32, overscan: 0 });
    cb.setViewportHeight(96);
    cb.setScrollTop(0);
    expect(cb.totalHeight).toBe(100 * 32);
    base.machine.send({ type: 'INPUT.CHANGE', value: 'City 1' });
    // The filter narrows; re-windowed items are a subset.
    expect(cb.totalHeight).toBeLessThan(100 * 32);
    expect(cb.visibleItems.length).toBeLessThanOrEqual(3);
  });

  it('empty filtered list yields an empty window with totalHeight=0', () => {
    const base = newCb(10);
    const cb = withVirtualization(base, { itemHeight: 32 });
    cb.setViewportHeight(96);
    base.machine.send({ type: 'INPUT.CHANGE', value: '__no_match__' });
    expect(cb.visibleItems).toEqual([]);
    expect(cb.totalHeight).toBe(0);
  });

  it('proxies base methods (open, close, setValue)', () => {
    const cb = withVirtualization(newCb(10), { itemHeight: 32 });
    cb.open();
    expect(cb.isOpen).toBe(true);
    cb.close();
    expect(cb.isOpen).toBe(false);
  });

  it('viewport changes recompute the window', () => {
    const cb = withVirtualization(newCb(100), { itemHeight: 32, overscan: 0 });
    cb.setViewportHeight(64);
    cb.setScrollTop(0);
    const before = cb.visibleItems.length;
    cb.setViewportHeight(256);
    expect(cb.visibleItems.length).toBeGreaterThan(before);
  });
});
