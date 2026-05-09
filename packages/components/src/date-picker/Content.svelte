<!--
  @component DatePicker.Content — popover content containing a Calendar.

  Renders Popover.Content + an embedded Calendar.Root. Selecting a date
  calls back through DatePicker context (closes the popover by default).

  Pass the `calendar` snippet to fully customize the calendar surface
  (layout, header style, locale-aware Intl options, etc.). The default
  shape is sufficient for most ISO-Gregorian use cases.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';
  import * as Popover from '../popover/index.js';
  import * as Calendar from '../calendar/index.js';
  import { DATE_PICKER_CONTEXT_KEY, type DatePickerContextValue } from './context.js';

  type Props = {
    /** Override the default Calendar render. Receives the locale + selectDate handler. */
    calendar?: Snippet<
      [
        args: {
          locale: string;
          selectDate: (date: CalendarDate) => void;
          value: CalendarDate | null;
        },
      ]
    >;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { calendar, children, class: className = '', ...rest }: Props = $props();

  const ctx = getContext<DatePickerContextValue>(DATE_PICKER_CONTEXT_KEY);
</script>

<Popover.Content class={className} {...rest}>
  {#if calendar}
    {@render calendar({ locale: ctx.locale, selectDate: ctx.selectDate, value: ctx.value })}
  {:else}
    <Calendar.Root
      value={ctx.value}
      minValue={ctx.minValue}
      maxValue={ctx.maxValue}
      onSelect={(d) => ctx.selectDate(d)}
    >
      <Calendar.Header locale={ctx.locale} />
      <Calendar.Grid locale={ctx.locale}>
        {#snippet day(cell)}
          <Calendar.Day date={cell.date} inMonth={cell.inMonth} />
        {/snippet}
      </Calendar.Grid>
    </Calendar.Root>
  {/if}
  {#if children}{@render children()}{/if}
</Popover.Content>
