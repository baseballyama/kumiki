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
    --kumiki-breadcrumb-link-fg: hsl(220 10% 30%);
    --kumiki-breadcrumb-link-fg-current: hsl(220 10% 12%);
    --kumiki-breadcrumb-separator-fg: hsl(220 10% 55%);

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
  /* Explicit :visited override — browser UA default would otherwise leak a
     low-contrast purple/pink for visited links on light backgrounds. */
  :global(.kumiki-breadcrumb [data-part='link']),
  :global(.kumiki-breadcrumb [data-part='link']:visited) {
    color: var(--kumiki-breadcrumb-link-fg);
    text-decoration: none;
    transition: color 120ms ease;
  }
  :global(.kumiki-breadcrumb [data-part='link']:hover),
  :global(.kumiki-breadcrumb [data-part='link']:focus-visible) {
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
      --kumiki-breadcrumb-link-fg: hsl(220 10% 78%);
      --kumiki-breadcrumb-link-fg-current: hsl(220 10% 96%);
      --kumiki-breadcrumb-separator-fg: hsl(220 10% 55%);
    }
  }
</style>
