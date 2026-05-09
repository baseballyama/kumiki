<script lang="ts">
  import { Root } from '@kumiki/components/datetime-field';
  import type { Snippet } from 'svelte';
  import type { CalendarDate, CalendarDateTime } from '@internationalized/date';

  type Props = {
    value?: CalendarDateTime | null;
    defaultValue?: CalendarDateTime | null;
    onValueChange?: (value: CalendarDateTime | null) => void;
    granularity?: 'minute' | 'second';
    hourCycle?: 12 | 24;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    disabled?: boolean;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<Root bind:value class={`flex flex-col gap-1 ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
