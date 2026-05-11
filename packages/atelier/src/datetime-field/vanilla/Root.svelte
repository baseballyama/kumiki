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
    --kumiki-datetime-field-bg: var(--kumiki-color-accent-fg);
    --kumiki-datetime-field-border: var(--kumiki-color-line);
    --kumiki-datetime-field-radius: 8px;

    display: flex;
    flex-direction: column;
    gap: 0.4375rem;
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.005em;
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
    color: var(--kumiki-color-fg);
    box-shadow:
      inset 0 1px 1px oklch(0 0 0 / 0.025),
      0 1px 1px oklch(0 0 0 / 0.02);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-datetime-field [data-component-part='date-part']:focus-within),
  :global(.kumiki-datetime-field [data-component-part='time-part']:focus-within) {
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-datetime-field [data-component-part='label']) {
    font-weight: 550;
    font-size: 0.8125rem;
    color: var(--kumiki-color-fg);
    line-height: 1.3;
  }
  :global {
    :root[data-theme='dark'] .kumiki-datetime-field {
      --kumiki-datetime-field-bg: var(--kumiki-color-surface);
      --kumiki-datetime-field-border: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-datetime-field [data-component-part='date-part'],
    :root[data-theme='dark'] .kumiki-datetime-field [data-component-part='time-part'] {
      color: var(--kumiki-color-surface);
    }
  }
  :global(
    :root[data-theme='dark'] .kumiki-datetime-field [data-component-part='date-part']:focus-within
  ),
  :global(
    :root[data-theme='dark'] .kumiki-datetime-field [data-component-part='time-part']:focus-within
  ) {
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 25%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.1);
  }
  :global(:root[data-theme='dark'] .kumiki-datetime-field [data-component-part='label']) {
    color: var(--kumiki-color-fg-muted);
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-datetime-field [data-component-part='date-part']),
    :global(.kumiki-datetime-field [data-component-part='time-part']) {
      transition: none;
    }
  }
</style>
