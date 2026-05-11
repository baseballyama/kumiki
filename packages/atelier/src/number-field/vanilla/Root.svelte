<script lang="ts">
  import { Root } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: number | null;
    defaultValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    disabled?: boolean;
    format?: (value: number) => string;
    parse?: (raw: string) => number | null | undefined;
    onValueChange?: (value: number | null) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<Root bind:value class={`kumiki-number-field ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-number-field) {
    --kumiki-number-field-bg: var(--kumiki-color-accent-fg);
    --kumiki-number-field-border: var(--kumiki-color-line);
    --kumiki-number-field-radius: 8px;

    display: inline-flex;
    overflow: hidden;
    border: 1px solid var(--kumiki-number-field-border);
    border-radius: var(--kumiki-number-field-radius);
    background: var(--kumiki-number-field-bg);
    box-shadow:
      inset 0 1px 1px oklch(0 0 0 / 0.025),
      0 1px 1px oklch(0 0 0 / 0.02);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-number-field:hover) {
    border-color: var(--kumiki-color-line-strong);
  }
  :global(.kumiki-number-field:focus-within) {
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-number-field input) {
    height: 2.25rem;
    width: 5rem;
    padding-inline: 0.625rem;
    border: 0;
    background: transparent;
    color: var(--kumiki-color-fg);
    font: inherit;
    font-size: 0.8125rem;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
    text-align: right;
  }
  :global(.kumiki-number-field input:focus-visible) {
    outline: 0;
  }
  :global(.kumiki-number-field [data-component-part='increment']),
  :global(.kumiki-number-field [data-component-part='decrement']) {
    width: 1.875rem;
    border: 0;
    background: transparent;
    color: var(--kumiki-color-fg-muted);
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1;
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-number-field [data-component-part='increment']) {
    border-left: 1px solid var(--kumiki-number-field-border);
  }
  :global(.kumiki-number-field [data-component-part='decrement']) {
    border-right: 1px solid var(--kumiki-number-field-border);
  }
  :global(.kumiki-number-field [data-component-part='increment']:hover),
  :global(.kumiki-number-field [data-component-part='decrement']:hover) {
    background: var(--kumiki-color-surface);
    color: var(--kumiki-color-fg);
  }
  :global {
    :root[data-theme='dark'] .kumiki-number-field {
      --kumiki-number-field-bg: var(--kumiki-color-surface);
      --kumiki-number-field-border: var(--kumiki-color-fg);
    }
    :root[data-theme='dark'] .kumiki-number-field:hover {
      border-color: oklch(0.42 0.014 256);
    }
    :root[data-theme='dark'] .kumiki-number-field:focus-within {
      border-color: var(--kumiki-color-accent);
      box-shadow:
        0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 25%, transparent),
        inset 0 1px 1px oklch(0 0 0 / 0.1);
    }
    :root[data-theme='dark'] .kumiki-number-field input {
      color: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-number-field [data-component-part='increment'],
    :root[data-theme='dark'] .kumiki-number-field [data-component-part='decrement'] {
      color: oklch(0.7 0.012 256);
    }
    :root[data-theme='dark'] .kumiki-number-field [data-component-part='increment']:hover,
    :root[data-theme='dark'] .kumiki-number-field [data-component-part='decrement']:hover {
      background: var(--kumiki-color-surface-raised);
      color: var(--kumiki-color-surface);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-number-field),
    :global(.kumiki-number-field [data-component-part='increment']),
    :global(.kumiki-number-field [data-component-part='decrement']) {
      transition: none;
    }
  }
</style>
