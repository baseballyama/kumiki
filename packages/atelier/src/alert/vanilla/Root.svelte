<script lang="ts">
  import { Root } from '@kumiki/components/alert';
  import type { Snippet } from 'svelte';

  type Props = {
    severity?: 'info' | 'success' | 'warn' | 'error';
    live?: 'polite' | 'assertive' | 'off';
    dismissible?: boolean;
    onDismiss?: () => void;
    id?: string;
    icon?: Snippet;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { severity = 'info', children, class: className = '', ...rest }: Props = $props();
</script>

<Root {severity} class={`kumiki-alert ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-alert) {
    --kumiki-alert-bg: hsl(200 90% 96%);
    --kumiki-alert-fg: hsl(200 90% 22%);
    --kumiki-alert-border: hsl(200 90% 80%);
    --kumiki-alert-radius: 6px;
    --kumiki-alert-padding: 1rem;

    position: relative;
    display: grid;
    gap: 0.25rem;
    padding: var(--kumiki-alert-padding);
    border: 1px solid var(--kumiki-alert-border);
    border-radius: var(--kumiki-alert-radius);
    background: var(--kumiki-alert-bg);
    color: var(--kumiki-alert-fg);
    font-size: 0.875rem;
  }
  :global(.kumiki-alert[data-severity='success']) {
    --kumiki-alert-bg: hsl(140 50% 95%);
    --kumiki-alert-fg: hsl(140 60% 20%);
    --kumiki-alert-border: hsl(140 60% 70%);
  }
  :global(.kumiki-alert[data-severity='warn']) {
    --kumiki-alert-bg: hsl(40 95% 94%);
    --kumiki-alert-fg: hsl(40 95% 25%);
    --kumiki-alert-border: hsl(40 95% 65%);
  }
  :global(.kumiki-alert[data-severity='error']) {
    --kumiki-alert-bg: hsl(0 80% 96%);
    --kumiki-alert-fg: hsl(0 80% 28%);
    --kumiki-alert-border: hsl(0 80% 75%);
  }
  :global(.kumiki-alert [data-part='title']) {
    font-weight: 600;
    line-height: 1.2;
  }
  :global(.kumiki-alert [data-part='description']) {
    opacity: 0.9;
  }
  :global(.kumiki-alert [data-part='close']) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 120ms ease;
  }
  :global(.kumiki-alert [data-part='close']:hover) {
    opacity: 1;
  }
</style>
