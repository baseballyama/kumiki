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
    --kumiki-calendar-bg: var(--kumiki-color-bg);
    --kumiki-calendar-border: var(--kumiki-color-line);
    --kumiki-calendar-cell-bg-hover: var(--kumiki-color-surface);
    --kumiki-calendar-cell-bg-selected: var(--kumiki-color-accent);
    --kumiki-calendar-cell-bg-in-range: var(--kumiki-color-accent-soft);
    --kumiki-calendar-cell-bg-today: oklch(0.97 0.005 247);
    --kumiki-calendar-cell-fg: var(--kumiki-color-fg);
    --kumiki-calendar-cell-fg-selected: var(--kumiki-color-accent-fg);
    --kumiki-calendar-cell-fg-disabled: var(--kumiki-color-fg-quiet);
    --kumiki-calendar-cell-radius: 8px;

    padding: 0.875rem;
    border: 1px solid var(--kumiki-calendar-border);
    border-radius: 12px;
    background: var(--kumiki-calendar-bg);
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.005em;
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 1px 1px oklch(0 0 0 / 0.02);
  }
  :global(.kumiki-calendar [data-component-part='header']) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.625rem;
    padding-inline: 0.125rem;
    font-weight: 600;
    color: var(--kumiki-color-fg);
  }
  :global(.kumiki-calendar [data-component-part='grid']) {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0.125rem;
    table-layout: fixed;
  }
  :global(.kumiki-calendar [data-component-part='grid'] thead th) {
    padding: 0.25rem 0 0.5rem;
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--kumiki-color-fg-quiet);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  :global(.kumiki-calendar [data-component-part='grid'] td) {
    padding: 0;
    text-align: center;
  }
  :global(.kumiki-calendar [data-component-part='day']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.125rem;
    height: 2.125rem;
    border: 0;
    background: transparent;
    border-radius: var(--kumiki-calendar-cell-radius);
    color: var(--kumiki-calendar-cell-fg);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-calendar [data-component-part='day']:not([data-in-month])) {
    color: var(--kumiki-color-fg-faint);
  }
  :global(.kumiki-calendar [data-component-part='header'] button) {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--kumiki-color-fg-quiet);
    width: 1.75rem;
    height: 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--kumiki-radius-pill, 9999px);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-calendar [data-component-part='header'] button:hover) {
    background: var(--kumiki-color-surface);
    color: var(--kumiki-color-fg);
  }
  :global(.kumiki-calendar [data-component-part='header'] [data-component-part='label']) {
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: -0.005em;
    color: var(--kumiki-color-fg);
  }
  :global(.kumiki-calendar [data-component-part='day']:hover:not([data-disabled])) {
    background: var(--kumiki-calendar-cell-bg-hover);
  }
  :global(.kumiki-calendar [data-component-part='day'][data-today]:not([data-state='selected'])) {
    background: var(--kumiki-calendar-cell-bg-today);
    color: var(--kumiki-color-accent);
    font-weight: 700;
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--kumiki-color-accent) 40%, transparent);
  }
  :global(
    .kumiki-calendar [data-component-part='day'][data-in-range]:not([data-state='selected'])
  ) {
    background: var(--kumiki-calendar-cell-bg-in-range);
  }
  :global(.kumiki-calendar [data-component-part='day'][data-state='selected']) {
    background: var(--kumiki-calendar-cell-bg-selected);
    color: var(--kumiki-calendar-cell-fg-selected);
    font-weight: 600;
    box-shadow: 0 1px 2px color-mix(in oklab, var(--kumiki-color-accent) 22%, transparent);
  }
  :global(.kumiki-calendar [data-component-part='day'][data-disabled]) {
    color: var(--kumiki-calendar-cell-fg-disabled);
    cursor: not-allowed;
  }
  :global(.kumiki-calendar [data-component-part='day']:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-color-accent);
  }
  :global {
    :root[data-theme='dark'] .kumiki-calendar {
      --kumiki-calendar-bg: oklch(0.2 0.012 256);
      --kumiki-calendar-border: var(--kumiki-color-fg);
      --kumiki-calendar-cell-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-calendar-cell-bg-selected: var(--kumiki-color-accent);
      --kumiki-calendar-cell-bg-in-range: oklch(0.32 0.04 35);
      --kumiki-calendar-cell-bg-today: oklch(0.25 0.014 256);
      --kumiki-calendar-cell-fg: var(--kumiki-color-fg-muted);
      --kumiki-calendar-cell-fg-disabled: oklch(0.42 0.012 256);
    }
    :root[data-theme='dark'] .kumiki-calendar [data-component-part='header'] {
      color: var(--kumiki-color-surface);
    }
  }
  :global(
    :root[data-theme='dark']
      .kumiki-calendar
      [data-component-part='day'][data-today]:not([data-state='selected'])
  ) {
    color: var(--kumiki-color-accent);
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--kumiki-color-accent) 50%, transparent);
  }
  :global(:root[data-theme='dark'] .kumiki-calendar [data-component-part='day']:focus-visible) {
    box-shadow:
      0 0 0 2px var(--kumiki-color-bg),
      0 0 0 4px var(--kumiki-color-accent);
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-calendar [data-component-part='day']) {
      transition: none;
    }
  }
</style>
