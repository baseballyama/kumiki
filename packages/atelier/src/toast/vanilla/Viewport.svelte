<script lang="ts">
  import { Viewport } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Viewport class={`kumiki-toast-viewport ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Viewport>

<style>
  :global(.kumiki-toast-viewport) {
    --kumiki-toast-region-gap: 0.5rem;

    pointer-events: none;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 50;
    display: flex;
    flex-direction: column-reverse;
    gap: var(--kumiki-toast-region-gap);
    width: 100%;
    max-width: 24rem;
  }
  :global(.kumiki-toast-viewport [data-component-part='item']) {
    --kumiki-toast-bg: white;
    --kumiki-toast-fg: hsl(220 10% 12%);
    --kumiki-toast-border: hsl(220 10% 86%);
    --kumiki-toast-radius: 6px;
    --kumiki-toast-padding: 1rem;
    --kumiki-toast-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);

    pointer-events: auto;
    position: relative;
    display: grid;
    gap: 0.25rem;
    padding: var(--kumiki-toast-padding);
    padding-right: 2rem;
    background: var(--kumiki-toast-bg);
    color: var(--kumiki-toast-fg);
    border: 1px solid var(--kumiki-toast-border);
    border-radius: var(--kumiki-toast-radius);
    box-shadow: var(--kumiki-toast-shadow);
    font-size: 0.875rem;
  }
  :global(.kumiki-toast-viewport [data-component-part='title']) {
    font-weight: 600;
  }
  :global(.kumiki-toast-viewport [data-component-part='description']) {
    opacity: 0.9;
  }
  :global(.kumiki-toast-viewport [data-component-part='close']) {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.6;
  }
  :global(.kumiki-toast-viewport [data-component-part='close']:hover) {
    opacity: 1;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-toast-viewport [data-component-part='item']) {
      --kumiki-toast-bg: hsl(220 10% 14%);
      --kumiki-toast-fg: hsl(220 10% 96%);
      --kumiki-toast-border: hsl(220 10% 28%);
    }
  }
</style>
