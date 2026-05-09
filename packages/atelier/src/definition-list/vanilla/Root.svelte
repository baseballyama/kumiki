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

<Root {layout} class={`kumiki-dl ${className}`.trim()} {...rest}>{@render children()}</Root>

<style>
  :global(.kumiki-dl) {
    --kumiki-dl-term-fg: hsl(220 10% 25%);
    --kumiki-dl-desc-fg: hsl(220 10% 40%);
    --kumiki-dl-gap-x: 1rem;
    --kumiki-dl-gap-y: 0.25rem;
    margin: 0;
    font-size: 0.875rem;
  }
  :global(.kumiki-dl[data-layout='inline']) {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: var(--kumiki-dl-gap-x);
    row-gap: var(--kumiki-dl-gap-y);
  }
  :global(.kumiki-dl [data-part='term']) {
    color: var(--kumiki-dl-term-fg);
    font-weight: 500;
  }
  :global(.kumiki-dl [data-part='description']) {
    color: var(--kumiki-dl-desc-fg);
    margin: 0;
  }
  :global(.kumiki-dl[data-layout='block']) > :global(* + *) {
    margin-top: 0.5rem;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-dl) {
      --kumiki-dl-term-fg: hsl(220 10% 80%);
      --kumiki-dl-desc-fg: hsl(220 10% 65%);
    }
  }
</style>
