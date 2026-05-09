<script lang="ts">
  import { Root } from '@kumiki/components/breadcrumb';
  import type { Snippet } from 'svelte';

  type Props = {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`kumiki-breadcrumb ${className}`.trim()} {...rest}>{@render children()}</Root>

<style>
  :global(.kumiki-breadcrumb) {
    --kumiki-breadcrumb-link-fg: hsl(220 10% 45%);
    --kumiki-breadcrumb-link-fg-current: hsl(220 10% 12%);
    --kumiki-breadcrumb-separator-fg: hsl(220 10% 70%);

    color: var(--kumiki-breadcrumb-link-fg);
    font-size: 0.875rem;
  }
  :global(.kumiki-breadcrumb ol) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
  }
  :global(.kumiki-breadcrumb [data-part='item']) {
    display: inline-flex;
    align-items: center;
  }
  :global(.kumiki-breadcrumb [data-part='link']) {
    color: inherit;
    text-decoration: none;
    transition: color 120ms ease;
  }
  :global(.kumiki-breadcrumb [data-part='link']:hover) {
    color: var(--kumiki-breadcrumb-link-fg-current);
    text-decoration: underline;
  }
  :global(.kumiki-breadcrumb [data-part='link'][data-current='page']) {
    color: var(--kumiki-breadcrumb-link-fg-current);
    font-weight: 500;
  }
  :global(.kumiki-breadcrumb [data-part='separator']) {
    color: var(--kumiki-breadcrumb-separator-fg);
    user-select: none;
    margin-inline: 0.25rem;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-breadcrumb) {
      --kumiki-breadcrumb-link-fg: hsl(220 10% 65%);
      --kumiki-breadcrumb-link-fg-current: hsl(220 10% 96%);
      --kumiki-breadcrumb-separator-fg: hsl(220 10% 45%);
    }
  }
</style>
