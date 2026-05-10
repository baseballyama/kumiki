<!--
  @component @kumiki/atelier/badge Vanilla variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/badge';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
    size?: 'sm' | 'md';
    decorative?: boolean;
    'aria-label'?: string;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    variant = 'neutral',
    size = 'md',
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root class={`kumiki-badge ${className}`.trim()} data-variant={variant} data-size={size} {...rest}>
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-badge) {
    --kumiki-badge-bg: hsl(220 10% 86%);
    --kumiki-badge-fg: hsl(220 10% 10%);
    --kumiki-badge-radius: 4px;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    border-radius: var(--kumiki-badge-radius);
    background: var(--kumiki-badge-bg);
    color: var(--kumiki-badge-fg);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    white-space: nowrap;
  }
  :global(.kumiki-badge[data-size='sm']) {
    font-size: 0.625rem;
    line-height: 1rem;
    padding: 0 0.375rem;
  }
  :global(.kumiki-badge[data-variant='info']) {
    --kumiki-badge-bg: hsl(200 90% 90%);
    --kumiki-badge-fg: hsl(200 90% 25%);
  }
  :global(.kumiki-badge[data-variant='success']) {
    --kumiki-badge-bg: hsl(140 50% 88%);
    --kumiki-badge-fg: hsl(140 60% 22%);
  }
  :global(.kumiki-badge[data-variant='warn']) {
    --kumiki-badge-bg: hsl(40 90% 88%);
    --kumiki-badge-fg: hsl(40 90% 25%);
  }
  :global(.kumiki-badge[data-variant='error']) {
    --kumiki-badge-bg: hsl(0 80% 90%);
    --kumiki-badge-fg: hsl(0 80% 30%);
  }
</style>
