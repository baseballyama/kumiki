/**
 * Internal context shared between Calendar.Root and the leaf components
 * (Header, Grid, Day, …).
 */
import type { CalendarController } from '@kumiki/headless/calendar';

export const CALENDAR_CONTEXT_KEY = Symbol('kumiki.calendar');

export interface CalendarContextValue {
  controller: CalendarController;
}

export type { CalendarController };
