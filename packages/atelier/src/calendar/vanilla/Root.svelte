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

<div class={`kumiki-calendar ${className}`.trim()}>
  <Root bind:value bind:focusedDate {...rest}>{@render children()}</Root>
</div>

<style>
  :global(.kumiki-calendar) {
    --kumiki-calendar-bg: white;
    --kumiki-calendar-border: hsl(220 10% 86%);
    --kumiki-calendar-cell-bg-hover: hsl(220 10% 92%);
    --kumiki-calendar-cell-bg-selected: hsl(220 10% 12%);
    --kumiki-calendar-cell-fg: hsl(220 10% 25%);
    --kumiki-calendar-cell-fg-selected: white;
    --kumiki-calendar-cell-fg-disabled: hsl(220 10% 65%);
    --kumiki-calendar-cell-radius: 4px;

    padding: 0.75rem;
    border: 1px solid var(--kumiki-calendar-border);
    border-radius: 6px;
    background: var(--kumiki-calendar-bg);
    font-size: 0.875rem;
  }
  :global(.kumiki-calendar [data-part='header']) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  :global(.kumiki-calendar [data-part='grid']) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }
  :global(.kumiki-calendar [data-part='day']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 0;
    background: transparent;
    border-radius: var(--kumiki-calendar-cell-radius);
    color: var(--kumiki-calendar-cell-fg);
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  :global(.kumiki-calendar [data-part='day']:hover) {
    background: var(--kumiki-calendar-cell-bg-hover);
  }
  :global(.kumiki-calendar [data-part='day'][data-selected]) {
    background: var(--kumiki-calendar-cell-bg-selected);
    color: var(--kumiki-calendar-cell-fg-selected);
  }
  :global(.kumiki-calendar [data-part='day'][data-today]) {
    font-weight: 700;
  }
  :global(.kumiki-calendar [data-part='day'][data-disabled]) {
    color: var(--kumiki-calendar-cell-fg-disabled);
    cursor: not-allowed;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-calendar) {
      --kumiki-calendar-bg: hsl(220 10% 14%);
      --kumiki-calendar-border: hsl(220 10% 28%);
      --kumiki-calendar-cell-bg-hover: hsl(220 10% 22%);
      --kumiki-calendar-cell-bg-selected: hsl(220 10% 96%);
      --kumiki-calendar-cell-fg: hsl(220 10% 80%);
      --kumiki-calendar-cell-fg-selected: hsl(220 10% 12%);
      --kumiki-calendar-cell-fg-disabled: hsl(220 10% 40%);
    }
  }
</style>
