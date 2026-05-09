<script lang="ts">
  import { Content } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type CalendarArgs = {
    locale: string;
    selectDate: (date: CalendarDate) => void;
    value: CalendarDate | null;
  };
  type Props = {
    calendar?: Snippet<[CalendarArgs]>;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Content
  class={`z-50 rounded-md border border-slate-200 bg-white p-3 shadow-lg outline-none dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Content>
