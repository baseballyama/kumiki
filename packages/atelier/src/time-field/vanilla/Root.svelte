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

<Root bind:value class={`kumiki-time-field ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-time-field) {
    --kumiki-time-field-bg: white;
    --kumiki-time-field-border: hsl(220 10% 80%);
    --kumiki-time-field-segment-bg-focus: hsl(220 10% 90%);
    --kumiki-time-field-segment-fg-empty: hsl(220 10% 65%);

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
  }
  :global(.kumiki-time-field [data-component-part='input']) {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    height: 2.25rem;
    padding-inline: 0.625rem;
    border: 1px solid var(--kumiki-time-field-border);
    border-radius: 6px;
    background: var(--kumiki-time-field-bg);
  }
  :global(.kumiki-time-field [data-component-part='segment']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.75rem;
    padding-inline: 0.25rem;
    border-radius: 3px;
    cursor: text;
  }
  :global(.kumiki-time-field [data-component-part='segment']:focus) {
    background: var(--kumiki-time-field-segment-bg-focus);
    outline: none;
  }
  :global(.kumiki-time-field [data-component-part='segment'][data-empty]) {
    color: var(--kumiki-time-field-segment-fg-empty);
  }
  :global(.kumiki-time-field [data-component-part='label']) {
    font-weight: 500;
    color: hsl(220 10% 25%);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-time-field) {
      --kumiki-time-field-bg: hsl(220 10% 14%);
      --kumiki-time-field-border: hsl(220 10% 28%);
      --kumiki-time-field-segment-bg-focus: hsl(220 10% 28%);
      --kumiki-time-field-segment-fg-empty: hsl(220 10% 50%);
    }
  }
</style>
