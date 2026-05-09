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

<Root bind:value class={`kumiki-datetime-field ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-datetime-field) {
    --kumiki-datetime-field-bg: white;
    --kumiki-datetime-field-border: hsl(220 10% 80%);
    --kumiki-datetime-field-radius: 6px;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
  }
  :global(.kumiki-datetime-field [data-component-part='date-part']),
  :global(.kumiki-datetime-field [data-component-part='time-part']) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.25rem;
    padding-inline: 0.75rem;
    border: 1px solid var(--kumiki-datetime-field-border);
    border-radius: var(--kumiki-datetime-field-radius);
    background: var(--kumiki-datetime-field-bg);
  }
  :global(.kumiki-datetime-field [data-component-part='label']) {
    font-weight: 500;
    color: hsl(220 10% 25%);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-datetime-field) {
      --kumiki-datetime-field-bg: hsl(220 10% 14%);
      --kumiki-datetime-field-border: hsl(220 10% 28%);
    }
  }
</style>
