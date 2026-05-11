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
    --kumiki-time-field-bg: var(--kumiki-color-accent-fg);
    --kumiki-time-field-border: var(--kumiki-color-line);
    --kumiki-time-field-segment-bg-focus: var(--kumiki-color-accent-soft);
    --kumiki-time-field-segment-fg-empty: var(--kumiki-color-fg-quiet);

    display: flex;
    flex-direction: column;
    gap: 0.4375rem;
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.005em;
  }
  :global(.kumiki-time-field [data-component-part='input']) {
    display: inline-flex;
    align-items: center;
    gap: 0.0625rem;
    height: 2.25rem;
    padding-inline: 0.625rem;
    border: 1px solid var(--kumiki-time-field-border);
    border-radius: 8px;
    background: var(--kumiki-time-field-bg);
    box-shadow:
      inset 0 1px 1px oklch(0 0 0 / 0.025),
      0 1px 1px oklch(0 0 0 / 0.02);
    color: var(--kumiki-color-fg);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-time-field [data-component-part='input']:focus-within) {
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-time-field [data-component-part='segment']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.75rem;
    padding-inline: 0.25rem;
    border-radius: 4px;
    cursor: text;
    transition: background-color 100ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-time-field [data-component-part='segment']:focus) {
    background: var(--kumiki-time-field-segment-bg-focus);
    color: var(--kumiki-color-accent);
    outline: none;
  }
  :global(.kumiki-time-field [data-component-part='segment'][data-empty]) {
    color: var(--kumiki-time-field-segment-fg-empty);
  }
  :global(.kumiki-time-field [data-component-part='label']) {
    font-weight: 550;
    font-size: 0.8125rem;
    color: var(--kumiki-color-fg);
    line-height: 1.3;
  }
  :global {
    :root[data-theme='dark'] .kumiki-time-field {
      --kumiki-time-field-bg: var(--kumiki-color-surface);
      --kumiki-time-field-border: var(--kumiki-color-fg);
      --kumiki-time-field-segment-bg-focus: oklch(0.32 0.06 35);
      --kumiki-time-field-segment-fg-empty: var(--kumiki-color-fg-muted);
    }
    :root[data-theme='dark'] .kumiki-time-field [data-component-part='input'] {
      color: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-time-field [data-component-part='input']:focus-within {
      border-color: var(--kumiki-color-accent);
      box-shadow:
        0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 25%, transparent),
        inset 0 1px 1px oklch(0 0 0 / 0.1);
    }
    :root[data-theme='dark'] .kumiki-time-field [data-component-part='segment']:focus {
      color: var(--kumiki-color-accent);
    }
    :root[data-theme='dark'] .kumiki-time-field [data-component-part='label'] {
      color: var(--kumiki-color-fg-muted);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-time-field [data-component-part='input']),
    :global(.kumiki-time-field [data-component-part='segment']) {
      transition: none;
    }
  }
</style>
