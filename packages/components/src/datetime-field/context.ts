/**
 * Internal context for DateTimeField — shared between Root and the
 * `DatePart` / `TimePart` shorthand parts.
 */

import type { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';

export const DATETIME_FIELD_CONTEXT_KEY = Symbol('kumiki.datetime-field');

export interface DateTimeFieldContextValue {
  readonly value: CalendarDateTime | null;
  readonly granularity: 'minute' | 'second';
  readonly hourCycle: 12 | 24;
  readonly minValue: CalendarDate | null;
  readonly maxValue: CalendarDate | null;
  readonly disabled: boolean;
  setDate(date: CalendarDate | null): void;
  setTime(time: Time | null): void;
}
