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
    --kumiki-number-field-bg: white;
    --kumiki-number-field-border: hsl(220 10% 80%);
    --kumiki-number-field-radius: 6px;

    display: inline-flex;
    overflow: hidden;
    border: 1px solid var(--kumiki-number-field-border);
    border-radius: var(--kumiki-number-field-radius);
    background: var(--kumiki-number-field-bg);
  }
  :global(.kumiki-number-field input) {
    height: 2.25rem;
    width: 5rem;
    padding-inline: 0.5rem;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  :global(.kumiki-number-field input:focus-visible) {
    outline: 0;
  }
  :global(.kumiki-number-field [data-component-part='increment']),
  :global(.kumiki-number-field [data-component-part='decrement']) {
    width: 1.75rem;
    border: 0;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  :global(.kumiki-number-field [data-component-part='increment']) {
    border-left: 1px solid var(--kumiki-number-field-border);
  }
  :global(.kumiki-number-field [data-component-part='decrement']) {
    border-right: 1px solid var(--kumiki-number-field-border);
  }
  :global(.kumiki-number-field [data-component-part='increment']:hover),
  :global(.kumiki-number-field [data-component-part='decrement']:hover) {
    background: hsl(220 10% 96%);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-number-field) {
      --kumiki-number-field-bg: hsl(220 10% 14%);
      --kumiki-number-field-border: hsl(220 10% 28%);
    }
  }
</style>
