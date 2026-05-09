<!--
  @component @kumiki/atelier/button Vanilla variant.

  Reads `--kumiki-button-*` per the §18 contract. Variants stack via
  `[data-variant=...]`.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/button';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon?: Snippet;
    iconTrailing?: Snippet;
    onclick?: (event: MouseEvent) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    variant = 'primary',
    size = 'md',
    icon,
    iconTrailing,
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root {variant} {size} {icon} {iconTrailing} class={`kumiki-button ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-button) {
    --kumiki-button-bg: hsl(220 90% 55%);
    --kumiki-button-bg-hover: hsl(220 90% 48%);
    --kumiki-button-bg-active: hsl(220 90% 42%);
    --kumiki-button-bg-disabled: hsl(220 10% 90%);
    --kumiki-button-fg: white;
    --kumiki-button-fg-disabled: hsl(220 10% 60%);
    --kumiki-button-border: transparent;
    --kumiki-button-radius: 6px;
    --kumiki-button-padding-x: 0.75rem;
    --kumiki-button-padding-y: 0;
    --kumiki-button-font-size: 0.875rem;
    --kumiki-button-font-weight: 500;
    --kumiki-button-icon-gap: 0.375rem;
    --kumiki-button-outline-focus: hsl(220 90% 60%);
    --kumiki-button-outline-offset: 2px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--kumiki-button-icon-gap);
    height: 2.25rem;
    padding-inline: var(--kumiki-button-padding-x);
    padding-block: var(--kumiki-button-padding-y);
    border: 1px solid var(--kumiki-button-border);
    border-radius: var(--kumiki-button-radius);
    background: var(--kumiki-button-bg);
    color: var(--kumiki-button-fg);
    font: inherit;
    font-size: var(--kumiki-button-font-size);
    font-weight: var(--kumiki-button-font-weight);
    cursor: pointer;
    transition: background-color 120ms ease;
  }
  :global(.kumiki-button[data-size='sm']) {
    height: 2rem;
    --kumiki-button-padding-x: 0.625rem;
    --kumiki-button-font-size: 0.75rem;
  }
  :global(.kumiki-button[data-size='lg']) {
    height: 2.5rem;
    --kumiki-button-padding-x: 1rem;
    --kumiki-button-font-size: 1rem;
  }
  :global(.kumiki-button[data-variant='secondary']) {
    --kumiki-button-bg: white;
    --kumiki-button-bg-hover: hsl(220 10% 96%);
    --kumiki-button-fg: hsl(220 10% 10%);
    --kumiki-button-border: hsl(220 10% 80%);
  }
  :global(.kumiki-button[data-variant='ghost']) {
    --kumiki-button-bg: transparent;
    --kumiki-button-bg-hover: hsl(220 10% 92%);
    --kumiki-button-fg: hsl(220 10% 10%);
  }
  :global(.kumiki-button[data-variant='danger']) {
    --kumiki-button-bg: hsl(0 80% 55%);
    --kumiki-button-bg-hover: hsl(0 80% 48%);
    --kumiki-button-bg-active: hsl(0 80% 42%);
  }
  :global(.kumiki-button:hover:not([data-disabled]):not([data-loading])) {
    background: var(--kumiki-button-bg-hover);
  }
  :global(.kumiki-button:active:not([data-disabled]):not([data-loading])) {
    background: var(--kumiki-button-bg-active);
  }
  :global(.kumiki-button:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 var(--kumiki-button-outline-offset) white,
      0 0 0 calc(var(--kumiki-button-outline-offset) + 2px) var(--kumiki-button-outline-focus);
  }
  :global(.kumiki-button[data-disabled]) {
    background: var(--kumiki-button-bg-disabled);
    color: var(--kumiki-button-fg-disabled);
    cursor: not-allowed;
  }
  :global(.kumiki-button[data-loading]) {
    opacity: 0.8;
    cursor: progress;
  }
</style>
