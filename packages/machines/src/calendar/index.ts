/**
 * `@kumiki/machines/calendar` — pure-TS finite state machine for the Calendar
 * grid.
 *
 * Behavior matches the WAI-ARIA APG Date Picker pattern (the static-grid
 * variant — month view shown as a grid of day cells):
 * https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#example-datepicker-dialog
 *
 * Single-date selection at v1.0. Range selection lands in Phase 2.1.
 *
 * Calendar arithmetic is delegated to `@internationalized/date` (Adobe; ADR
 * 0013). The machine takes its `CalendarDate` type as `import type` only —
 * runtime calendar math happens via the `add` / `subtract` / `set` methods
 * already on the CalendarDate instance the consumer constructed.
 *
 * @see docs/components/calendar.md
 * @see docs/design/16-decisions/0013-internationalized-date.md
 */

import type { CalendarDate, DateValue } from '@internationalized/date';
import { defineMachine, type Machine } from '@kumiki/runtime';

// ─── Public types ─────────────────────────────────────────────────────────

/** Calendar machine events. */
export type CalendarEvent =
  /** Absolute focus to a specific date (e.g. clicking a day cell). */
  | { type: 'FOCUS_DATE'; date: CalendarDate }
  /** Relative focus by N days (±1 for left/right arrow, ±7 for up/down). */
  | { type: 'FOCUS_DAY_DELTA'; days: number }
  /** Relative focus by N months (±1 for PageUp / PageDown). */
  | { type: 'FOCUS_MONTH_DELTA'; months: number }
  /** Relative focus by N years (±1 for Shift+PageUp / Shift+PageDown). */
  | { type: 'FOCUS_YEAR_DELTA'; years: number }
  /** User selected the focused (or supplied) date. Space / Enter / click. */
  | { type: 'SELECT'; date: CalendarDate }
  /** Controlled-mode update from the parent component. */
  | { type: 'SET_VALUE'; date: CalendarDate | null }
  /** Disable / re-enable the calendar. */
  | { type: 'DISABLE' }
  | { type: 'ENABLE' };

/** Predicate for marking individual dates as unavailable (e.g. holidays). */
export type IsDateUnavailable = (date: CalendarDate) => boolean;

/** Reactive context surfaced to consumers. */
export interface CalendarContext {
  /** Currently focused day cell. Mirrors `tabindex="0"` on its grid cell. */
  focusedDate: CalendarDate;
  /** Currently selected date, or `null` if nothing is selected yet. */
  selectedDate: CalendarDate | null;
  /** Inclusive lower bound for selectable dates. `null` = no floor. */
  minValue: CalendarDate | null;
  /** Inclusive upper bound for selectable dates. `null` = no ceiling. */
  maxValue: CalendarDate | null;
  /**
   * Disable predicate. Returns `true` if the given date should be marked
   * unavailable in the grid (e.g. a public holiday). Pure function — must
   * not capture mutable external state if you want predictable transitions.
   */
  isDateUnavailable: IsDateUnavailable | null;
  /** Number of user-initiated selections since construction (telemetry hook). */
  selections: number;
}

/** State names. */
export type CalendarState = 'idle' | 'disabled';

/** A running Calendar machine instance. */
export type CalendarMachine = Machine<CalendarContext, CalendarEvent, CalendarState>;

/** Construction input. */
export interface CreateCalendarInput {
  /** Date to focus initially. Required — the grid must always have a focused cell. */
  focusedDate: CalendarDate;
  /** Initial selection. Defaults to `null` (no selection). */
  selectedDate?: CalendarDate | null;
  /** Inclusive lower bound for selectable dates. */
  minValue?: CalendarDate | null;
  /** Inclusive upper bound for selectable dates. */
  maxValue?: CalendarDate | null;
  /** Disable predicate. */
  isDateUnavailable?: IsDateUnavailable | null;
  /** Construct in the disabled state. Defaults to `false`. */
  disabled?: boolean;
}

// ─── Helpers (internal) ───────────────────────────────────────────────────

/** Compare two CalendarDate values. Returns -1/0/1 like Array.sort comparator. */
function compareDates(a: DateValue, b: DateValue): number {
  return a.compare(b);
}

/** True if `date` falls within `[min, max]` inclusive (treating `null` as ±∞). */
function inRange(date: CalendarDate, min: CalendarDate | null, max: CalendarDate | null): boolean {
  if (min !== null && compareDates(date, min) < 0) return false;
  if (max !== null && compareDates(date, max) > 0) return false;
  return true;
}

/** True if `date` is selectable (in range AND not flagged unavailable). */
function isSelectable(date: CalendarDate, ctx: CalendarContext): boolean {
  if (!inRange(date, ctx.minValue, ctx.maxValue)) return false;
  if (ctx.isDateUnavailable && ctx.isDateUnavailable(date)) return false;
  return true;
}

// ─── Machine ──────────────────────────────────────────────────────────────

const factory = /* @__PURE__ */ defineMachine<CalendarContext, CalendarEvent, CalendarState>({
  id: 'calendar',
  initial: 'idle',
  // Context is filled in at construction time by `createCalendarMachine`;
  // the placeholder values here only exist so the type checker is happy.
  context: {
    focusedDate: undefined as unknown as CalendarDate,
    selectedDate: null,
    minValue: null,
    maxValue: null,
    isDateUnavailable: null,
    selections: 0,
  },
  states: {
    idle: {
      on: {
        FOCUS_DATE: {
          target: 'idle',
          actions: [
            {
              type: 'focusDate',
              exec: (_ctx, e) => (e.type === 'FOCUS_DATE' ? { focusedDate: e.date } : {}),
            },
          ],
        },
        FOCUS_DAY_DELTA: {
          target: 'idle',
          actions: [
            {
              type: 'focusDayDelta',
              exec: (ctx, e) => {
                if (e.type !== 'FOCUS_DAY_DELTA') return {};
                return { focusedDate: ctx.focusedDate.add({ days: e.days }) };
              },
            },
          ],
        },
        FOCUS_MONTH_DELTA: {
          target: 'idle',
          actions: [
            {
              type: 'focusMonthDelta',
              exec: (ctx, e) => {
                if (e.type !== 'FOCUS_MONTH_DELTA') return {};
                return { focusedDate: ctx.focusedDate.add({ months: e.months }) };
              },
            },
          ],
        },
        FOCUS_YEAR_DELTA: {
          target: 'idle',
          actions: [
            {
              type: 'focusYearDelta',
              exec: (ctx, e) => {
                if (e.type !== 'FOCUS_YEAR_DELTA') return {};
                return { focusedDate: ctx.focusedDate.add({ years: e.years }) };
              },
            },
          ],
        },
        SELECT: {
          target: 'idle',
          // Reject SELECT for unavailable / out-of-range dates.
          cond: (ctx, e) => e.type === 'SELECT' && isSelectable(e.date, ctx),
          actions: [
            {
              type: 'select',
              exec: (ctx, e) => {
                if (e.type !== 'SELECT') return {};
                return {
                  selectedDate: e.date,
                  focusedDate: e.date,
                  selections: ctx.selections + 1,
                };
              },
            },
          ],
        },
        SET_VALUE: {
          target: 'idle',
          // Idempotency guard: don't transition if the controlled value is unchanged.
          cond: (ctx, e) => {
            if (e.type !== 'SET_VALUE') return false;
            if (e.date === null && ctx.selectedDate === null) return false;
            if (
              e.date !== null &&
              ctx.selectedDate !== null &&
              compareDates(e.date, ctx.selectedDate) === 0
            ) {
              return false;
            }
            return true;
          },
          actions: [
            {
              type: 'controlledSet',
              exec: (_ctx, e) => {
                if (e.type !== 'SET_VALUE') return {};
                return e.date === null
                  ? { selectedDate: null }
                  : { selectedDate: e.date, focusedDate: e.date };
              },
            },
          ],
        },
        DISABLE: 'disabled',
      },
    },
    disabled: {
      // Like Toggle, the disabled state ignores all interaction events. Only
      // ENABLE returns control. Controlled SET_VALUE is also accepted in
      // disabled state so the parent can preconfigure the value before
      // re-enabling.
      on: {
        ENABLE: 'idle',
        SET_VALUE: {
          target: 'disabled',
          cond: (ctx, e) => {
            if (e.type !== 'SET_VALUE') return false;
            if (e.date === null && ctx.selectedDate === null) return false;
            if (
              e.date !== null &&
              ctx.selectedDate !== null &&
              compareDates(e.date, ctx.selectedDate) === 0
            ) {
              return false;
            }
            return true;
          },
          actions: [
            {
              type: 'controlledSetWhileDisabled',
              exec: (_ctx, e) => {
                if (e.type !== 'SET_VALUE') return {};
                return e.date === null
                  ? { selectedDate: null }
                  : { selectedDate: e.date, focusedDate: e.date };
              },
            },
          ],
        },
      },
    },
  },
});

/**
 * Construct a fresh Calendar machine.
 *
 * @when-to-use Tests, custom integrations, or whenever you need calendar grid
 *              logic without the Svelte adapter.
 *
 * @anti-pattern Don't share a single machine instance between two
 *               `<Calendar.Root>` components — each component owns its
 *               machine.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */
export function createCalendarMachine(input: CreateCalendarInput): CalendarMachine {
  const {
    focusedDate,
    selectedDate = null,
    minValue = null,
    maxValue = null,
    isDateUnavailable = null,
    disabled = false,
  } = input;

  return factory({
    state: disabled ? 'disabled' : 'idle',
    context: {
      focusedDate,
      selectedDate,
      minValue,
      maxValue,
      isDateUnavailable,
      selections: 0,
    },
  });
}

/**
 * Pure helper: is a given date selectable given the constraints in `ctx`?
 * Exported so the headless / component layers can render `aria-disabled`
 * without round-tripping through the machine.
 */
export function isCalendarDateSelectable(
  date: CalendarDate,
  ctx: Pick<CalendarContext, 'minValue' | 'maxValue' | 'isDateUnavailable'>,
): boolean {
  return isSelectable(date, ctx as CalendarContext);
}
