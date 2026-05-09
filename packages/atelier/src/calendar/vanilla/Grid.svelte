<script lang="ts">
  import { Grid } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type DayCell = { date: CalendarDate; inMonth: boolean };
  type Props = {
    locale?: string;
    'aria-label'?: string;
    day: Snippet<[DayCell]>;
    weekdayHeader?: Snippet<[ReadonlyArray<{ short: string; long: string }>]>;
    class?: string;
    [k: string]: unknown;
  };
  let { day, weekdayHeader, class: className = '', ...rest }: Props = $props();
</script>

<Grid {day} {weekdayHeader} class={className} {...rest} />
