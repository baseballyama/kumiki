/**
 * Internal context for DatePicker — wraps Popover + Calendar value/locale.
 */
import type { CalendarDate } from '@internationalized/date';

export const DATE_PICKER_CONTEXT_KEY = Symbol('kumiki.date-picker');

export interface DatePickerContextValue {
  /** Current selected date (`null` if nothing is selected). */
  readonly value: CalendarDate | null;
  /** BCP-47 locale for formatting. */
  readonly locale: string;
  /** Optional Intl.DateTimeFormat options used by the trigger label. */
  readonly displayFormat: Intl.DateTimeFormatOptions;
  /** Inclusive lower bound for selectable dates. */
  readonly minValue: CalendarDate | null;
  /** Inclusive upper bound for selectable dates. */
  readonly maxValue: CalendarDate | null;
  /**
   * Called when the inner Calendar reports a selection. The DatePicker
   * compound uses this to also auto-close the popover.
   */
  selectDate: (date: CalendarDate) => void;
  /** Placeholder text for the trigger button when value is `null`. */
  readonly placeholder: string;
}
