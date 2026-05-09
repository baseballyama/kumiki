<!--
  @component DateTimeField.Root — owns the combined `CalendarDateTime` value
  and splits it into a `CalendarDate` (DatePicker) + `Time` (TimeField) pair.

  Bindable:
  - `value` (CalendarDateTime | null)

  Plain:
  - `granularity` ('minute' | 'second'). Default `'minute'`.
  - `hourCycle` (12 | 24). Default `24`.
  - `minValue` / `maxValue` — date-side bounds; forwarded to DatePicker.
  - `disabled` / `id`.

  No new ARIA — children own their own roles. The Root is a transparent
  context provider so the markup mirrors the spec:

  ```svelte
  <DateTimeField.Root bind:value>
    <DateTimeField.Label>Scheduled at</DateTimeField.Label>
    <DateTimeField.DatePart />
    <DateTimeField.TimePart />
  </DateTimeField.Root>
  ```
-->
<script lang="ts">
  import { setContext, untrack } from 'svelte';
  import type { Snippet } from 'svelte';
  import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
  import { uid } from '@kumiki/primitives/id';
  import { DATETIME_FIELD_CONTEXT_KEY, type DateTimeFieldContextValue } from './context.js';

  type Props = {
    value?: CalendarDateTime | null;
    defaultValue?: CalendarDateTime | null;
    onValueChange?: (value: CalendarDateTime | null) => void;
    granularity?: 'minute' | 'second';
    hourCycle?: 12 | 24;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    disabled?: boolean;
    id?: string;
    children: Snippet;
    /** Extra props (`class`, `style`, …) forwarded to the wrapper. */
    [key: string]: unknown;
  };

  let {
    value = $bindable(undefined),
    defaultValue = null,
    onValueChange,
    granularity = 'minute',
    hourCycle = 24,
    minValue = null,
    maxValue = null,
    disabled = false,
    id,
    children,
    ...rest
  }: Props = $props();

  const fieldId = untrack(() => id ?? uid('datetime-field'));

  let internal = $state<CalendarDateTime | null>(untrack(() => value ?? defaultValue));
  $effect(() => {
    if (value !== undefined && !sameDateTime(internal, value)) internal = value;
  });

  function sameDateTime(a: CalendarDateTime | null, b: CalendarDateTime | null): boolean {
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    return a.compare(b) === 0;
  }

  function commit(next: CalendarDateTime | null): void {
    if (sameDateTime(internal, next)) return;
    internal = next;
    value = next;
    onValueChange?.(next);
  }

  function setDate(date: CalendarDate | null): void {
    if (date === null) {
      commit(null);
      return;
    }
    const t = internal ?? new Time(0, 0, 0);
    commit(new CalendarDateTime(date.year, date.month, date.day, t.hour, t.minute, t.second));
  }

  function setTime(time: Time | null): void {
    if (time === null) {
      // Keep the date if present; otherwise clear.
      if (!internal) return;
      commit(null);
      return;
    }
    const base = internal ?? defaultValue ?? new CalendarDateTime(1970, 1, 1, 0, 0, 0);
    commit(
      new CalendarDateTime(base.year, base.month, base.day, time.hour, time.minute, time.second),
    );
  }

  setContext<DateTimeFieldContextValue>(DATETIME_FIELD_CONTEXT_KEY, {
    get value() {
      return internal;
    },
    get granularity() {
      return granularity;
    },
    get hourCycle() {
      return hourCycle;
    },
    get minValue() {
      return minValue;
    },
    get maxValue() {
      return maxValue;
    },
    get disabled() {
      return disabled;
    },
    setDate,
    setTime,
  });
</script>

<div
  {...rest}
  id={fieldId}
  data-component-host="datetime-field"
  data-disabled={disabled ? '' : undefined}
>
  {@render children()}
</div>
