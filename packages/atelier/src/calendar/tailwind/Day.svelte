<script lang="ts">
  import { Day } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type Props = { date: CalendarDate; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Day
  class={`inline-flex h-8 w-8 items-center justify-center rounded text-sm hover:bg-slate-100 data-[selected]:bg-slate-900 data-[selected]:text-white data-[today]:font-bold data-[disabled]:opacity-30 dark:hover:bg-slate-800 dark:data-[selected]:bg-slate-100 dark:data-[selected]:text-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Day>
