<script lang="ts">
  import { Day } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type Props = { date: CalendarDate; children?: Snippet; class?: string; [k: string]: unknown };
  let { date, children, class: className = '', ...rest }: Props = $props();
</script>

{#if children}
  <Day {date} class={className} {...rest}>
    {@render children()}
  </Day>
{:else}
  <Day {date} class={className} {...rest} />
{/if}
