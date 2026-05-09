<!--
  @component Calendar.Header — month/year heading + prev/next month buttons.

  Renders a label like "May 2026" by default; pass the `label` snippet to
  fully control formatting (e.g. for non-Gregorian calendars or custom
  Intl.DateTimeFormat options).
-->
<script lang="ts">
  import { getContext, onDestroy } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';
  import { CALENDAR_CONTEXT_KEY, type CalendarContextValue } from './context.js';

  type Props = {
    /** BCP-47 locale used for the default month/year label. Defaults to `en-US`. */
    locale?: string;
    label?: Snippet<[focusedDate: CalendarDate]>;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { locale = 'en-US', label, children, class: className = '', ...rest }: Props = $props();

  const { controller } = getContext<CalendarContextValue>(CALENDAR_CONTEXT_KEY);

  let focused = $state<CalendarDate>(controller.focusedDate);
  const unsub = controller.subscribe(({ context }) => (focused = context.focusedDate));
  onDestroy(unsub);

  const monthFormatter = $derived(
    new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
  );
  const monthLabel = $derived(
    monthFormatter.format(new Date(focused.year, focused.month - 1, focused.day)),
  );

  function prevMonth(): void {
    if (controller.disabled) return;
    controller.focus(focused.add({ months: -1 }));
  }
  function nextMonth(): void {
    if (controller.disabled) return;
    controller.focus(focused.add({ months: 1 }));
  }
</script>

<div class={className} {...rest}>
  <button type="button" aria-label="Previous month" onclick={prevMonth} data-calendar-nav="prev">
    ‹
  </button>
  <div aria-live="polite" data-calendar-month-label>
    {#if label}{@render label(focused)}{:else}{monthLabel}{/if}
  </div>
  <button type="button" aria-label="Next month" onclick={nextMonth} data-calendar-nav="next">
    ›
  </button>
  {#if children}{@render children()}{/if}
</div>
