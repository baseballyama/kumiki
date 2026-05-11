<!--
  @component Calendar.Day — a single day cell button.

  Spread on a `<button>`. Reads ARIA + tabindex from the controller via
  the per-cell attachment. The consumer can render their own visuals
  (number, holiday markers, …) inside `children`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { type CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
  import { CALENDAR_CONTEXT_KEY, type CalendarContextValue } from './context.js';

  type Props = {
    date: CalendarDate;
    /** True if the day is in the focused month (vs. a leading/trailing pad day). */
    inMonth?: boolean;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { date, inMonth = true, children, class: className = '', ...rest }: Props = $props();

  const { controller } = getContext<CalendarContextValue>(CALENDAR_CONTEXT_KEY);
  // `today` is read at render time so day cells correctly highlight when the
  // wall clock crosses midnight. `getLocalTimeZone()` is host-locale-aware.
  const isToday = $derived.by(() => {
    try {
      return today(getLocalTimeZone()).compare(date) === 0;
    } catch {
      return false;
    }
  });
</script>

<td>
  <button
    type="button"
    class={className}
    data-component-part="day"
    data-in-month={inMonth ? '' : undefined}
    data-today={isToday ? '' : undefined}
    {@attach controller.dayCell(date)}
    {...rest}
  >
    {#if children}{@render children()}{:else}{date.day}{/if}
  </button>
</td>
