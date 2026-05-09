<script lang="ts">
  import { Root } from '@kumiki/components/time-field';
  import type { Snippet } from 'svelte';
  import type { Time } from '@internationalized/date';

  type Props = {
    value?: Time | null;
    defaultValue?: Time | null;
    onValueChange?: (value: Time | null) => void;
    granularity?: 'minute' | 'second';
    hourCycle?: 12 | 24;
    minuteStep?: number;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    invalid?: boolean;
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
