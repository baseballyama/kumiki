<script lang="ts">
  import { Root } from '@kumiki/components/definition-list';
  import type { Snippet } from 'svelte';

  type Props = {
    layout?: 'inline' | 'block';
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { layout = 'block', children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`kumiki-dl ${className}`.trim()} data-layout={layout} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-dl) {
    --kumiki-dl-term-fg: var(--kumiki-color-fg-muted);
    --kumiki-dl-desc-fg: var(--kumiki-color-fg);
    --kumiki-dl-gap-x: 1.5rem;
    --kumiki-dl-gap-y: 0.625rem;
    margin: 0;
    font-size: 0.8125rem;
    line-height: 1.5;
    letter-spacing: -0.005em;
  }
  :global(.kumiki-dl[data-layout='inline']) {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: var(--kumiki-dl-gap-x);
    row-gap: var(--kumiki-dl-gap-y);
    align-items: baseline;
  }
  :global(.kumiki-dl [data-component-part='term']) {
    color: var(--kumiki-dl-term-fg);
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.6875rem;
    letter-spacing: 0.04em;
  }
  :global(.kumiki-dl [data-component-part='description']) {
    color: var(--kumiki-dl-desc-fg);
    font-size: 0.875rem;
    margin: 0;
  }
  :global(.kumiki-dl[data-layout='block']) > :global(* + *) {
    margin-top: 0.625rem;
  }
  :global {
    :root[data-theme='dark'] .kumiki-dl {
      --kumiki-dl-term-fg: oklch(0.65 0.012 256);
      --kumiki-dl-desc-fg: var(--kumiki-color-surface);
    }
  }
</style>
