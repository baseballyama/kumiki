<!--
  @component Calendar.Grid — the day-cell grid container.

  Renders a `<table>` (semantic grid). Iterates the visible month's weeks
  and exposes each day's `CalendarDate` to the consumer via a `day` snippet.
  The consumer renders the actual `<Calendar.Day>` cells.
-->
<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    CalendarDate,
    endOfMonth,
    startOfMonth,
    startOfWeek,
    endOfWeek,
  } from '@internationalized/date';
  import { CALENDAR_CONTEXT_KEY, type CalendarContextValue } from './context.js';

  type DayCell = {
    date: CalendarDate;
    /** True if the date is in the focused month (vs. a leading/trailing pad day). */
    inMonth: boolean;
  };
  type WeekRow = ReadonlyArray<DayCell>;

  type Props = {
    /** BCP-47 locale used for `startOfWeek`. Defaults to `en-US`. */
    locale?: string;
    /** Optional aria-label override; defaults to the focused month/year. */
    'aria-label'?: string;
    /** Snippet receiving each day cell. */
    day: Snippet<[cell: DayCell]>;
    /** Snippet receiving the week-day header labels. */
    weekdayHeader?: Snippet<[weekdays: ReadonlyArray<{ short: string; long: string }>]>;
    class?: string;
    [k: string]: unknown;
  };

  let {
    locale = 'en-US',
    'aria-label': ariaLabel,
    day,
    weekdayHeader,
    class: className = '',
    ...rest
  }: Props = $props();

  const { controller } = getContext<CalendarContextValue>(CALENDAR_CONTEXT_KEY);

  let focused = $state<CalendarDate>(controller.focusedDate);
  const unsub = controller.subscribe(({ context }) => (focused = context.focusedDate));
  onDestroy(unsub);

  const weeks: WeekRow[] = $derived.by(() => {
    const monthStart = startOfMonth(focused);
    const monthEnd = endOfMonth(focused);
    const gridStart = startOfWeek(monthStart, locale);
    const gridEnd = endOfWeek(monthEnd, locale);
    const out: WeekRow[] = [];
    let cursor = gridStart;
    while (cursor.compare(gridEnd) <= 0) {
      const row: DayCell[] = [];
      for (let i = 0; i < 7; i++) {
        row.push({ date: cursor, inMonth: cursor.month === focused.month });
        cursor = cursor.add({ days: 1 });
      }
      out.push(row);
    }
    return out;
  });

  const weekdays = $derived.by(() => {
    const ref = startOfWeek(focused, locale);
    const shortFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    const longFmt = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    return Array.from({ length: 7 }, (_, i) => {
      const d = ref.add({ days: i });
      const js = new Date(d.year, d.month - 1, d.day);
      return { short: shortFmt.format(js), long: longFmt.format(js) };
    });
  });

  const labelFmt = $derived(new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }));
  const computedAriaLabel = $derived(
    ariaLabel ?? labelFmt.format(new Date(focused.year, focused.month - 1, focused.day)),
  );
</script>

<table
  aria-label={computedAriaLabel}
  class={className}
  data-component-part="grid"
  {@attach controller.root}
  {...rest}
>
  <thead>
    <tr>
      {#if weekdayHeader}
        {@render weekdayHeader(weekdays)}
      {:else}
        {#each weekdays as wd (wd.long)}
          <th scope="col" abbr={wd.long}>{wd.short}</th>
        {/each}
      {/if}
    </tr>
  </thead>
  <tbody>
    {#each weeks as week, i (i)}
      <tr>
        {#each week as cell (cell.date.toString())}
          {@render day(cell)}
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
