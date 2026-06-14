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

import { startOfWeek, endOfWeek, type CalendarDate } from '@internationalized/date';
import {
  createCalendarMachine,
  isCalendarDateSelectable,
  type CalendarContext,
  type CalendarEvent,
  type CalendarMachine,
  type CalendarState,
  type CreateCalendarInput,
  type IsDateUnavailable,
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
  setConstraints(constraints: {
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    isDateUnavailable?: IsDateUnavailable | null;
  }): void;

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
  /**
   * BCP-47 locale used to build each day cell's `aria-label` (the full,
   * human-readable date announced by screen readers). Defaults to `'en-US'`.
   */
  locale?: string;
  /** Stable id override. */
  id?: string;
}

// ─── Implementation ──────────────────────────────────────────────────────

export function createCalendar(options: CreateCalendarOptions): CalendarController {
  const machine = createCalendarMachine(options);
  const id = options.id ?? uid('calendar');
  const direction = options.direction ?? 'ltr';
  const locale = options.locale ?? 'en-US';

  let dateLabelFmt: Intl.DateTimeFormat | undefined;

  function dayCellId(date: CalendarDate): string {
    return `${id}-day-${date}`;
  }

  function isSelectable(date: CalendarDate): boolean {
    return isCalendarDateSelectable(date, machine.context);
  }

  function moveDomFocusTo(date: CalendarDate): void {
    if (typeof document === 'undefined') return;
    const node = document.getElementById(dayCellId(date));
    if (node) node.focus();
  }

  function eventForKey(e: KeyboardEvent, focusedDate: CalendarDate): CalendarEvent | null {
    const rtl = direction === 'rtl';
    const k = e.key;
    switch (k) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown': {
        const days: Record<string, number> = {
          ArrowLeft: rtl ? 1 : -1,
          ArrowRight: rtl ? -1 : 1,
          ArrowUp: -7,
          ArrowDown: 7,
        };
        return { type: 'FOCUS_DAY_DELTA', days: days[k]! };
      }
      case 'PageUp':
      case 'PageDown': {
        const delta = k === 'PageUp' ? -1 : 1;
        return e.shiftKey
          ? { type: 'FOCUS_YEAR_DELTA', years: delta }
          : { type: 'FOCUS_MONTH_DELTA', months: delta };
      }
      case 'Home':
      case 'End': {
        const fromEnd = k === 'End';
        const start = startOfWeek(focusedDate, locale);
        const end = endOfWeek(focusedDate, locale);
        const step = fromEnd ? -1 : 1;
        let c = fromEnd ? end : start;
        while (c.compare(fromEnd ? start : end) * -step >= 0) {
          if (isSelectable(c)) return { type: 'FOCUS_DATE', date: c };
          c = c.add({ days: step });
        }
        return null;
      }
      case 'Enter':
      case ' ':
        return { type: 'SELECT', date: focusedDate };
      default:
        return null;
    }
  }

  // ── root attachment: keyboard nav at the grid level ────────────────────
  const root: Attachment = (node) => {
    if (!node.hasAttribute('role')) node.setAttribute('role', 'grid');

    const onKeydown = (e: KeyboardEvent): void => {
      if (machine.state === 'disabled') return;
      const event = eventForKey(e, machine.context.focusedDate);
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
      node.id = dayCellId(date);

      // Full human-readable date as the accessible name (APG), so screen
      // readers announce "June 9, 2026" rather than the bare "9".
      dateLabelFmt ??= new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
      node.ariaLabel = dateLabelFmt.format(new Date(date.year, date.month - 1, date.day));

      function paint(): void {
        const focused = machine.context.focusedDate.compare(date) === 0;
        const selected =
          machine.context.selectedDate !== null && machine.context.selectedDate.compare(date) === 0;
        const selectable = isSelectable(date);

        node.tabIndex = -+!focused;
        node.ariaSelected = '' + selected;
        node.ariaDisabled = selectable ? null : 'true';
        node.toggleAttribute('data-disabled', !selectable);
        node.setAttribute('data-state', selected ? 'selected' : 'unselected');
        node.toggleAttribute('data-focused', focused);
      }

      paint();

      const onClick = (e: MouseEvent): void => {
        if (machine.state === 'disabled') return;
        if (!isSelectable(date)) return;
        e.preventDefault();
        const beforeSelected = machine.context.selectedDate;
        machine.send({ type: 'SELECT', date });
        const after = machine.context.selectedDate;
        if (after !== beforeSelected && after !== null) options.onSelect?.(date);
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
      if (machine.context.selectedDate === date) options.onSelect?.(date);
    },
    setValue: (date: CalendarDate | null) => machine.send({ type: 'SET_VALUE', date }),
    setDisabled: (disabled: boolean) =>
      machine.send({ type: disabled ? 'DISABLE' : 'ENABLE' } as CalendarEvent),
    setConstraints: (c) => machine.send({ type: 'SET_CONSTRAINTS', ...c }),
    dayCellId,
    isSelectable,
    subscribe: machine.subscribe,
    root,
    dayCell,
    machine,
  };
}

// Re-export machine types so consumers don't have to import two packages.
export type { CalendarContext, CalendarEvent, CalendarMachine, CalendarState, CreateCalendarInput };
export type { IsDateUnavailable } from '@kumiki/machines/calendar';
