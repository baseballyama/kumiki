// @vitest-environment jsdom
import { CalendarDate } from '@internationalized/date';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createCalendar } from './index.ts';

const d = (y: number, m: number, day: number) => new CalendarDate(y, m, day);

describe('createCalendar attachment', () => {
  let grid: HTMLDivElement;
  let teardown: (() => void) | void;
  const teardowns: Array<() => void> = [];

  beforeEach(() => {
    grid = document.createElement('div');
    document.body.appendChild(grid);
  });

  afterEach(() => {
    teardown?.();
    teardown = undefined;
    while (teardowns.length) teardowns.pop()?.();
    grid.remove();
  });

  function mountGridWithCells(c: ReturnType<typeof createCalendar>, dates: CalendarDate[]) {
    teardown = c.root(grid);
    for (const date of dates) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.testid = `day-${date.day}`;
      grid.appendChild(btn);
      const off = c.dayCell(date)(btn);
      if (typeof off === 'function') teardowns.push(off);
    }
  }

  it('sets role="grid" on the root element', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    teardown = c.root(grid);
    expect(grid.getAttribute('role')).toBe('grid');
  });

  it('paints aria + data attributes on day cells', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9), d(2026, 5, 10)]);
    const focused = grid.querySelector<HTMLButtonElement>('[data-testid="day-9"]')!;
    const other = grid.querySelector<HTMLButtonElement>('[data-testid="day-10"]')!;
    expect(focused.tabIndex).toBe(0);
    expect(other.tabIndex).toBe(-1);
    expect(focused.getAttribute('aria-selected')).toBe('false');
  });

  it('selects on click and updates aria-selected', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9)]);
    const cell = grid.querySelector<HTMLButtonElement>('[data-testid="day-9"]')!;
    cell.click();
    expect(c.selectedDate?.compare(d(2026, 5, 9))).toBe(0);
    expect(cell.getAttribute('aria-selected')).toBe('true');
    expect(cell.getAttribute('data-state')).toBe('selected');
  });

  it('keyboard: ArrowRight moves focus +1 day in LTR', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9), d(2026, 5, 10)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(c.focusedDate.compare(d(2026, 5, 10))).toBe(0);
  });

  it('keyboard: ArrowRight moves focus -1 day in RTL', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9), direction: 'rtl' });
    mountGridWithCells(c, [d(2026, 5, 8), d(2026, 5, 9)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(c.focusedDate.compare(d(2026, 5, 8))).toBe(0);
  });

  it('keyboard: ArrowDown moves focus +7 days', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(c.focusedDate.compare(d(2026, 5, 16))).toBe(0);
  });

  it('keyboard: PageUp moves focus -1 month', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
    expect(c.focusedDate.compare(d(2026, 4, 9))).toBe(0);
  });

  it('keyboard: Shift+PageDown moves focus +1 year', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9)]);
    grid.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'PageDown', shiftKey: true, bubbles: true }),
    );
    expect(c.focusedDate.compare(d(2027, 5, 9))).toBe(0);
  });

  it('keyboard: Home jumps to first day of month', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 20) });
    mountGridWithCells(c, [d(2026, 5, 20)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(c.focusedDate.compare(d(2026, 5, 1))).toBe(0);
  });

  it('keyboard: End jumps to last day of month', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 20) });
    mountGridWithCells(c, [d(2026, 5, 20)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(c.focusedDate.compare(d(2026, 5, 31))).toBe(0);
  });

  it('keyboard: Enter selects the focused date', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9) });
    mountGridWithCells(c, [d(2026, 5, 9)]);
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(c.selectedDate?.compare(d(2026, 5, 9))).toBe(0);
  });

  it('respects min/max — out-of-range dates are aria-disabled', () => {
    const c = createCalendar({
      focusedDate: d(2026, 5, 9),
      minValue: d(2026, 5, 5),
      maxValue: d(2026, 5, 15),
    });
    mountGridWithCells(c, [d(2026, 5, 1), d(2026, 5, 9), d(2026, 5, 20)]);
    expect(grid.querySelector('[data-testid="day-1"]')!.getAttribute('aria-disabled')).toBe('true');
    expect(grid.querySelector('[data-testid="day-9"]')!.getAttribute('aria-disabled')).toBeNull();
    expect(grid.querySelector('[data-testid="day-20"]')!.getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('clicking a disabled cell does NOT select', () => {
    const c = createCalendar({
      focusedDate: d(2026, 5, 9),
      minValue: d(2026, 5, 5),
      maxValue: d(2026, 5, 15),
    });
    mountGridWithCells(c, [d(2026, 5, 1)]);
    const cell = grid.querySelector<HTMLButtonElement>('[data-testid="day-1"]')!;
    cell.click();
    expect(c.selectedDate).toBeNull();
  });

  it('exposes deterministic dayCellId', () => {
    const c = createCalendar({ focusedDate: d(2026, 5, 9), id: 'cal' });
    expect(c.dayCellId(d(2026, 5, 9))).toBe('cal-day-2026-05-09');
    expect(c.dayCellId(d(2026, 12, 31))).toBe('cal-day-2026-12-31');
  });
});
