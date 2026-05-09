import { CalendarDate } from '@internationalized/date';
import { describe, expect, it } from 'vitest';
import { createCalendarMachine, isCalendarDateSelectable } from './index.ts';

const d = (y: number, m: number, day: number) => new CalendarDate(y, m, day);

describe('createCalendarMachine — initial state', () => {
  it('starts in `idle` with the given focused date', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9) });
    expect(m.state).toBe('idle');
    expect(m.context.focusedDate.compare(d(2026, 5, 9))).toBe(0);
    expect(m.context.selectedDate).toBeNull();
    expect(m.context.selections).toBe(0);
  });

  it('honors `selectedDate` and `disabled` inputs', () => {
    const m = createCalendarMachine({
      focusedDate: d(2026, 5, 9),
      selectedDate: d(2026, 5, 1),
      disabled: true,
    });
    expect(m.state).toBe('disabled');
    expect(m.context.selectedDate?.compare(d(2026, 5, 1))).toBe(0);
  });
});

describe('FOCUS_DATE / FOCUS_*_DELTA', () => {
  it('FOCUS_DATE moves focus to the given date', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9) });
    m.send({ type: 'FOCUS_DATE', date: d(2026, 5, 20) });
    expect(m.context.focusedDate.compare(d(2026, 5, 20))).toBe(0);
  });

  it('FOCUS_DAY_DELTA shifts focus by N days, including across month boundaries', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 30) });
    m.send({ type: 'FOCUS_DAY_DELTA', days: 3 });
    expect(m.context.focusedDate.compare(d(2026, 6, 2))).toBe(0);
    m.send({ type: 'FOCUS_DAY_DELTA', days: -7 });
    expect(m.context.focusedDate.compare(d(2026, 5, 26))).toBe(0);
  });

  it('FOCUS_MONTH_DELTA shifts focus by N months', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9) });
    m.send({ type: 'FOCUS_MONTH_DELTA', months: 2 });
    expect(m.context.focusedDate.compare(d(2026, 7, 9))).toBe(0);
  });

  it('FOCUS_YEAR_DELTA shifts focus by N years', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9) });
    m.send({ type: 'FOCUS_YEAR_DELTA', years: -1 });
    expect(m.context.focusedDate.compare(d(2025, 5, 9))).toBe(0);
  });
});

describe('SELECT', () => {
  it('selects the given date and increments the counter', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9) });
    m.send({ type: 'SELECT', date: d(2026, 5, 9) });
    expect(m.context.selectedDate?.compare(d(2026, 5, 9))).toBe(0);
    expect(m.context.selections).toBe(1);
    expect(m.context.focusedDate.compare(d(2026, 5, 9))).toBe(0);
  });

  it('rejects SELECT for dates outside [minValue, maxValue]', () => {
    const m = createCalendarMachine({
      focusedDate: d(2026, 5, 9),
      minValue: d(2026, 5, 1),
      maxValue: d(2026, 5, 31),
    });
    m.send({ type: 'SELECT', date: d(2026, 4, 30) });
    expect(m.context.selectedDate).toBeNull();
    m.send({ type: 'SELECT', date: d(2026, 6, 1) });
    expect(m.context.selectedDate).toBeNull();
  });

  it('rejects SELECT for dates flagged unavailable', () => {
    const m = createCalendarMachine({
      focusedDate: d(2026, 5, 9),
      isDateUnavailable: (date) => date.day === 9,
    });
    m.send({ type: 'SELECT', date: d(2026, 5, 9) });
    expect(m.context.selectedDate).toBeNull();
    m.send({ type: 'SELECT', date: d(2026, 5, 10) });
    expect(m.context.selectedDate?.compare(d(2026, 5, 10))).toBe(0);
  });
});

describe('SET_VALUE (controlled)', () => {
  it('updates selectedDate and follows focus', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 1, 1) });
    m.send({ type: 'SET_VALUE', date: d(2026, 12, 25) });
    expect(m.context.selectedDate?.compare(d(2026, 12, 25))).toBe(0);
    expect(m.context.focusedDate.compare(d(2026, 12, 25))).toBe(0);
  });

  it('clears selection on `null`', () => {
    const m = createCalendarMachine({
      focusedDate: d(2026, 5, 9),
      selectedDate: d(2026, 5, 9),
    });
    m.send({ type: 'SET_VALUE', date: null });
    expect(m.context.selectedDate).toBeNull();
  });

  it('is idempotent on identical dates (no extra transitions)', () => {
    const m = createCalendarMachine({
      focusedDate: d(2026, 5, 9),
      selectedDate: d(2026, 5, 9),
    });
    let transitions = 0;
    // subscribe() fires once immediately with the initial snapshot; we count
    // only the post-subscription transitions.
    m.subscribe(() => transitions++);
    transitions = 0;
    m.send({ type: 'SET_VALUE', date: d(2026, 5, 9) });
    expect(transitions).toBe(0);
  });

  it('also accepts SET_VALUE while disabled (preconfigure before re-enable)', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 1, 1), disabled: true });
    m.send({ type: 'SET_VALUE', date: d(2026, 7, 4) });
    expect(m.state).toBe('disabled');
    expect(m.context.selectedDate?.compare(d(2026, 7, 4))).toBe(0);
  });
});

describe('DISABLE / ENABLE', () => {
  it('blocks SELECT and FOCUS events while disabled', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9) });
    m.send({ type: 'DISABLE' });
    expect(m.state).toBe('disabled');
    m.send({ type: 'SELECT', date: d(2026, 5, 9) });
    expect(m.context.selectedDate).toBeNull();
    m.send({ type: 'FOCUS_DAY_DELTA', days: 1 });
    expect(m.context.focusedDate.compare(d(2026, 5, 9))).toBe(0);
  });

  it('returns to idle on ENABLE', () => {
    const m = createCalendarMachine({ focusedDate: d(2026, 5, 9), disabled: true });
    m.send({ type: 'ENABLE' });
    expect(m.state).toBe('idle');
  });
});

describe('isCalendarDateSelectable', () => {
  it('respects min/max', () => {
    const ctx = { minValue: d(2026, 1, 1), maxValue: d(2026, 12, 31), isDateUnavailable: null };
    expect(isCalendarDateSelectable(d(2026, 6, 15), ctx)).toBe(true);
    expect(isCalendarDateSelectable(d(2025, 12, 31), ctx)).toBe(false);
    expect(isCalendarDateSelectable(d(2027, 1, 1), ctx)).toBe(false);
  });

  it('respects isDateUnavailable', () => {
    const ctx = {
      minValue: null,
      maxValue: null,
      isDateUnavailable: (date: CalendarDate) => date.day === 13,
    };
    expect(isCalendarDateSelectable(d(2026, 5, 13), ctx)).toBe(false);
    expect(isCalendarDateSelectable(d(2026, 5, 12), ctx)).toBe(true);
  });
});
