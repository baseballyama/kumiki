<script lang="ts">
  import { Root } from '@kumiki/components/toolbar';
  import type { Snippet } from 'svelte';

  type Base = {
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props = Base & ({ 'aria-label': string } | { 'aria-labelledby': string });

  let { orientation = 'horizontal', children, class: className = '', ...rest }: Props = $props();
</script>

<Root {orientation} class={`kumiki-toolbar ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-toolbar) {
    --kumiki-toolbar-bg: white;
    --kumiki-toolbar-border: hsl(220 10% 86%);
    --kumiki-toolbar-radius: 6px;
    --kumiki-toolbar-padding: 0.25rem;
    --kumiki-toolbar-gap: 0.25rem;

    display: inline-flex;
    align-items: center;
    gap: var(--kumiki-toolbar-gap);
    padding: var(--kumiki-toolbar-padding);
    border: 1px solid var(--kumiki-toolbar-border);
    border-radius: var(--kumiki-toolbar-radius);
    background: var(--kumiki-toolbar-bg);
  }
  :global(.kumiki-toolbar[data-orientation='vertical']) {
    flex-direction: column;
    align-items: stretch;
  }
  :global(.kumiki-toolbar [data-part='item']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    padding: 0 0.5rem;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  :global(.kumiki-toolbar [data-part='item']:hover:not([data-disabled])) {
    background: hsl(220 10% 92%);
  }
  :global(.kumiki-toolbar [data-part='item'][data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global(.kumiki-toolbar [data-part='separator']) {
    width: 1px;
    height: 1.25rem;
    background: hsl(220 10% 86%);
    margin-inline: 0.25rem;
  }
  :global(.kumiki-toolbar[data-orientation='vertical'] [data-part='separator']) {
    width: 100%;
    height: 1px;
    margin-inline: 0;
    margin-block: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-toolbar) {
      --kumiki-toolbar-bg: hsl(220 10% 14%);
      --kumiki-toolbar-border: hsl(220 10% 28%);
    }
    :global(.kumiki-toolbar [data-part='item']:hover:not([data-disabled])) {
      background: hsl(220 10% 22%);
    }
    :global(.kumiki-toolbar [data-part='separator']) {
      background: hsl(220 10% 28%);
    }
  }
</style>
