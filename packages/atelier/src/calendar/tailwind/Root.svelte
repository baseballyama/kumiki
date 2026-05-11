<script lang="ts">
  import { Root } from '@kumiki/components/calendar';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type Props = {
    value?: CalendarDate | null;
    defaultValue?: CalendarDate | null;
    focusedDate?: CalendarDate;
    defaultFocusedDate?: CalendarDate;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    isDateUnavailable?: ((date: CalendarDate) => boolean) | null;
    disabled?: boolean;
    direction?: 'ltr' | 'rtl';
    onSelect?: (date: CalendarDate) => void;
    onFocusChange?: (date: CalendarDate) => void;
    id?: string;
    children: Snippet;
    class?: string;
  };

  let {
    value = $bindable(undefined),
    focusedDate = $bindable(undefined),
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<div
  class={`p-3.5 rounded-xl border border-slate-200 bg-white text-[0.8125rem] tabular-nums tracking-[-0.005em] shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
>
  <Root bind:value bind:focusedDate {...rest}>{@render children()}</Root>
</div>
