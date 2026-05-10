<!--
  @component @kumiki/atelier/icon-button Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/icon-button';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon: Snippet;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    [k: string]: unknown;
  } & ({ 'aria-label': string } | { 'aria-labelledby': string });

  let { variant = 'ghost', size = 'md', icon, class: className = '', ...rest }: Props = $props();
</script>

<Root
  {icon}
  class={`kumiki-icon-button ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
/>

<style>
  :global(.kumiki-icon-button) {
    --kumiki-icon-button-bg: transparent;
    --kumiki-icon-button-bg-hover: hsl(220 10% 92%);
    --kumiki-icon-button-fg: hsl(220 10% 10%);
    --kumiki-icon-button-radius: 6px;
    --kumiki-icon-button-size: 2.25rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--kumiki-icon-button-size);
    height: var(--kumiki-icon-button-size);
    border: 0;
    border-radius: var(--kumiki-icon-button-radius);
    background: var(--kumiki-icon-button-bg);
    color: var(--kumiki-icon-button-fg);
    cursor: pointer;
    transition: background-color 120ms ease;
  }
  :global(.kumiki-icon-button[data-size='sm']) {
    --kumiki-icon-button-size: 2rem;
  }
  :global(.kumiki-icon-button[data-size='lg']) {
    --kumiki-icon-button-size: 2.5rem;
  }
  :global(.kumiki-icon-button:hover:not([data-disabled])) {
    background: var(--kumiki-icon-button-bg-hover);
  }
  :global(.kumiki-icon-button:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px white,
      0 0 0 4px hsl(220 90% 60%);
  }
  :global(.kumiki-icon-button[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
