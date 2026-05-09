<script lang="ts">
  import { Root } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type Props = {
    value?: CalendarDate | null;
    defaultValue?: CalendarDate | null;
    open?: boolean;
    defaultOpen?: boolean;
    locale?: string;
    displayFormat?: Intl.DateTimeFormatOptions;
    placeholder?: string;
    minValue?: CalendarDate | null;
    maxValue?: CalendarDate | null;
    closeOnSelect?: boolean;
    onValueChange?: (value: CalendarDate | null) => void;
    onOpenChange?: (open: boolean) => void;
    children: Snippet;
  };

  let {
    value = $bindable(undefined),
    open = $bindable(undefined),
    children,
    ...rest
  }: Props = $props();
</script>

<Root bind:value bind:open {...rest}>{@render children()}</Root>
