<script lang="ts">
  import { Day } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type Props = { date: CalendarDate; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Day class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Day>
