/**
 * `@kumiki/headless/calendar` — Layer 3 Svelte 5 attachments for the Calendar
 * machine.
 *
 * Provides two attachments:
 *
 * - `root` — bound to the grid container; handles keyboard navigation
 *   (arrows, Home/End, PageUp/Down, Shift+Page, Enter/Space) at the grid
 *   level via event delegation.
 * - `dayCell(date)` — bound to each `<button>` day cell; paints
 *   `aria-selected`, `tabindex`, and `data-state` from machine state.
 *
 * Day cells use deterministic ids of the form `{controllerId}-day-{YYYY-MM-DD}`
 * so the controller can move physical DOM focus to a date by querying
 * `document.getElementById` — no per-cell registration needed.
 *
 * @see docs/components/calendar.md
 * @see docs/design/02-architecture.md §2.5
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 */

import type { CalendarDate } from '@internationalized/date';
import {
  createCalendarMachine,
  isCalendarDateSelectable,
  type CalendarContext,
  type CalendarEvent,
  type CalendarMachine,
  type CalendarState,
  type CreateCalendarInput,
} from '@kumiki/machines/calendar';
import { uid } from '@kumiki/primitives/id';

// ─── Public types ─────────────────────────────────────────────────────────

export type Attachment = (node: HTMLElement) => void | (() => void);

export interface CalendarController {
  /** Stable controller id, used to derive deterministic day-cell ids. */
  readonly id: string;

  // Reactive read-only state.
  readonly state: CalendarState;
  readonly context: Readonly<CalendarContext>;
  readonly focusedDate: CalendarDate;
  readonly selectedDate: CalendarDate | null;
  readonly disabled: boolean;

  // Imperative API.
  focus(date: CalendarDate): void;
  select(date: CalendarDate): void;
  setValue(date: CalendarDate | null): void;
  setDisabled(disabled: boolean): void;

  /** Compute the deterministic id for a day cell. */
  dayCellId(date: CalendarDate): string;
  /** Pure helper: is this date currently selectable? */
  isSelectable(date: CalendarDate): boolean;

  /** Subscribe to state changes. Returns an unsubscribe. */
  subscribe(
    listener: (snapshot: { state: CalendarState; context: CalendarContext }) => void,
  ): () => void;

  /** Attachment for the grid container — owns keyboard nav. */
  readonly root: Attachment;
  /** Factory: attachment for a specific day cell. */
  dayCell(date: CalendarDate): Attachment;

  /** Underlying machine — exposed for advanced use, debugging, and tests. */
  readonly machine: CalendarMachine;
}

export interface CreateCalendarOptions extends CreateCalendarInput {
  /** Called when the user selects a new date. Not called for controlled `setValue`. */
  onSelect?: (date: CalendarDate) => void;
  /** Called whenever focus moves to a new date (keyboard or programmatic). */
  onFocusChange?: (date: CalendarDate) => void;
  /**
   * Reading direction. RTL inverts the meaning of `ArrowLeft`/`ArrowRight`
   * to follow visual flow. Defaults to `'ltr'`.
   */
  direction?: 'ltr' | 'rtl';
  /** Stable id override. */
  id?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/** Format a CalendarDate as `YYYY-MM-DD` (era-agnostic, calendar-aware). */
function formatDateKey(date: CalendarDate): string {
  const y = String(date.year).padStart(4, '0');
  const m = String(date.month).padStart(2, '0');
  const d = String(date.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Map a keyboard event to a Calendar machine event. */
function eventForKey(
  e: KeyboardEvent,
  direction: 'ltr' | 'rtl',
  focusedDate: CalendarDate,
): CalendarEvent | null {
  const dirSign = direction === 'rtl' ? -1 : 1;
  switch (e.key) {
    case 'ArrowLeft':
      return { type: 'FOCUS_DAY_DELTA', days: -1 * dirSign };
    case 'ArrowRight':
      return { type: 'FOCUS_DAY_DELTA', days: 1 * dirSign };
    case 'ArrowUp':
      return { type: 'FOCUS_DAY_DELTA', days: -7 };
    case 'ArrowDown':
      return { type: 'FOCUS_DAY_DELTA', days: 7 };
    case 'PageUp':
      return e.shiftKey
        ? { type: 'FOCUS_YEAR_DELTA', years: -1 }
        : { type: 'FOCUS_MONTH_DELTA', months: -1 };
    case 'PageDown':
      return e.shiftKey
        ? { type: 'FOCUS_YEAR_DELTA', years: 1 }
        : { type: 'FOCUS_MONTH_DELTA', months: 1 };
    case 'Home': {
      // First day of the focused month.
      const firstOfMonth = focusedDate.set({ day: 1 });
      return { type: 'FOCUS_DATE', date: firstOfMonth };
    }
    case 'End': {
      // Last day of the focused month.
      const monthLength = focusedDate.calendar.getDaysInMonth(focusedDate);
      const lastOfMonth = focusedDate.set({ day: monthLength });
      return { type: 'FOCUS_DATE', date: lastOfMonth };
    }
    case 'Enter':
    case ' ':
      return { type: 'SELECT', date: focusedDate };
    default:
      return null;
  }
}

// ─── Implementation ──────────────────────────────────────────────────────

export function createCalendar(options: CreateCalendarOptions): CalendarController {
  const machine = createCalendarMachine(options);
  const id = options.id ?? uid('calendar');
  const direction = options.direction ?? 'ltr';

  function dayCellId(date: CalendarDate): string {
    return `${id}-day-${formatDateKey(date)}`;
  }

  function isSelectable(date: CalendarDate): boolean {
    return isCalendarDateSelectable(date, machine.context);
  }

  /** Move physical DOM focus to the cell for `date`, if it's mounted. */
  function moveDomFocusTo(date: CalendarDate): void {
    if (typeof document === 'undefined') return;
    const node = document.getElementById(dayCellId(date));
    if (node) node.focus();
  }

  // ── root attachment: keyboard nav at the grid level ────────────────────
  const root: Attachment = (node) => {
    if (!node.hasAttribute('role')) node.setAttribute('role', 'grid');
    node.setAttribute('aria-readonly', 'false');

    const onKeydown = (e: KeyboardEvent): void => {
      if (machine.state === 'disabled') return;
      const event = eventForKey(e, direction, machine.context.focusedDate);
      if (!event) return;
      e.preventDefault();
      const beforeFocus = machine.context.focusedDate;
      const beforeSelected = machine.context.selectedDate;
      machine.send(event);
      const afterFocus = machine.context.focusedDate;
      const afterSelected = machine.context.selectedDate;

      if (afterFocus !== beforeFocus) {
        moveDomFocusTo(afterFocus);
        options.onFocusChange?.(afterFocus);
      }
      if (afterSelected !== beforeSelected && afterSelected !== null) {
        options.onSelect?.(afterSelected);
      }
    };

    node.addEventListener('keydown', onKeydown);
    return () => node.removeEventListener('keydown', onKeydown);
  };

  // ── per-day-cell attachment ────────────────────────────────────────────
  function dayCell(date: CalendarDate): Attachment {
    return (node) => {
      const cellId = dayCellId(date);
      node.id = cellId;
      if (!node.hasAttribute('role')) node.setAttribute('role', 'gridcell');

      function paint(): void {
        const focused = machine.context.focusedDate.compare(date) === 0;
        const selected =
          machine.context.selectedDate !== null && machine.context.selectedDate.compare(date) === 0;
        const selectable = isSelectable(date);

        node.tabIndex = focused ? 0 : -1;
        node.setAttribute('aria-selected', selected ? 'true' : 'false');
        if (!selectable) {
          node.setAttribute('aria-disabled', 'true');
          node.setAttribute('data-disabled', '');
        } else {
          node.removeAttribute('aria-disabled');
          node.removeAttribute('data-disabled');
        }
        node.setAttribute('data-state', selected ? 'selected' : 'unselected');
        if (focused) node.setAttribute('data-focused', '');
        else node.removeAttribute('data-focused');
      }

      paint();

      const onClick = (e: MouseEvent): void => {
        if (machine.state === 'disabled') return;
        if (!isSelectable(date)) return;
        e.preventDefault();
        machine.send({ type: 'SELECT', date });
        options.onSelect?.(date);
      };

      const unsubscribe = machine.subscribe(() => paint());
      node.addEventListener('click', onClick);

      return () => {
        unsubscribe();
        node.removeEventListener('click', onClick);
      };
    };
  }

  return {
    id,
    get state() {
      return machine.state;
    },
    get context() {
      return machine.context;
    },
    get focusedDate() {
      return machine.context.focusedDate;
    },
    get selectedDate() {
      return machine.context.selectedDate;
    },
    get disabled() {
      return machine.state === 'disabled';
    },
    focus: (date: CalendarDate) => {
      machine.send({ type: 'FOCUS_DATE', date });
      moveDomFocusTo(date);
      options.onFocusChange?.(date);
    },
    select: (date: CalendarDate) => {
      machine.send({ type: 'SELECT', date });
      if (machine.context.selectedDate?.compare(date) === 0) {
        options.onSelect?.(date);
      }
    },
    setValue: (date: CalendarDate | null) => machine.send({ type: 'SET_VALUE', date }),
    setDisabled: (disabled: boolean) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as CalendarEvent),
    dayCellId,
    isSelectable,
    subscribe: machine.subscribe.bind(machine),
    root,
    dayCell,
    machine,
  };
}

// Re-export machine types so consumers don't have to import two packages.
export type { CalendarContext, CalendarEvent, CalendarMachine, CalendarState, CreateCalendarInput };
export type { IsDateUnavailable } from '@kumiki/machines/calendar';
