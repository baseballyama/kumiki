<!--
  @component DatePicker.Root — composed of Popover + Calendar.

  Owns:
  - `value` (CalendarDate | null) — bindable selected date
  - `open` (boolean) — bindable popover open state, auto-closed after select

  Defers Popover keyboard semantics (Escape, outside-click) to the
  underlying Popover compound; defers grid keyboard semantics (arrows,
  Home/End, Page) to the Calendar compound.

  See APG date-picker dialog pattern:
  https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#example-datepicker-dialog
-->
<script lang="ts">
  import { setContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';
  import * as Popover from '../popover/index.js';
  import { DATE_PICKER_CONTEXT_KEY, type DatePickerContextValue } from './context.js';

  type Props = {
    /** Currently selected date. Bind for two-way control. */
    value?: CalendarDate | null;
    /** Initial selection in uncontrolled mode. */
    defaultValue?: CalendarDate | null;
    /** Whether the popover is open. */
    open?: boolean;
    /** Initial popover state in uncontrolled mode. */
    defaultOpen?: boolean;
    /** BCP-47 locale used for the trigger's display label. Defaults to `en-US`. */
    locale?: string;
    /** `Intl.DateTimeFormat` options for the trigger label. */
    displayFormat?: Intl.DateTimeFormatOptions;
    /** Placeholder shown in the trigger when no date is selected. */
    placeholder?: string;
    /** Inclusive lower bound for selectable dates. */
    minValue?: CalendarDate | null;
    /** Inclusive upper bound for selectable dates. */
    maxValue?: CalendarDate | null;
    /** Whether to close the popover automatically on selection. Default: `true`. */
    closeOnSelect?: boolean;
    onValueChange?: (value: CalendarDate | null) => void;
    onOpenChange?: (open: boolean) => void;
    children: Snippet;
  };

  let {
    value = $bindable(undefined),
    defaultValue = null,
    open = $bindable(undefined),
    defaultOpen = false,
    locale = 'en-US',
    displayFormat = { dateStyle: 'medium' },
    placeholder = 'Pick a date',
    minValue = null,
    maxValue = null,
    closeOnSelect = true,
    onValueChange,
    onOpenChange,
    children,
  }: Props = $props();

  // Internal state — we don't pass value through to the Calendar inside
  // Content as a controlled prop; instead Calendar emits onSelect, we
  // update our value here, then we close the popover.
  let internalValue = $state<CalendarDate | null>(untrack(() => value ?? defaultValue));
  let internalOpen = $state<boolean>(untrack(() => open ?? defaultOpen));

  // Mirror controlled props in.
  $effect(() => {
    if (value !== undefined && !sameDate(internalValue, value)) internalValue = value;
  });
  $effect(() => {
    if (open !== undefined && open !== internalOpen) internalOpen = open;
  });

  function sameDate(a: CalendarDate | null, b: CalendarDate | null): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.compare(b) === 0;
  }

  function selectDate(date: CalendarDate): void {
    internalValue = date;
    value = date;
    onValueChange?.(date);
    if (closeOnSelect) {
      internalOpen = false;
      open = false;
      onOpenChange?.(false);
    }
  }

  setContext<DatePickerContextValue>(DATE_PICKER_CONTEXT_KEY, {
    get value() {
      return internalValue;
    },
    get locale() {
      return locale;
    },
    get displayFormat() {
      return displayFormat;
    },
    get minValue() {
      return minValue;
    },
    get maxValue() {
      return maxValue;
    },
    get placeholder() {
      return placeholder;
    },
    selectDate,
  });

  function handlePopoverOpenChange(next: boolean): void {
    internalOpen = next;
    open = next;
    onOpenChange?.(next);
  }
</script>

<Popover.Root bind:open={internalOpen} onOpenChange={handlePopoverOpenChange}>
  {@render children()}
</Popover.Root>
