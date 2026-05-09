<script lang="ts">
  import { Root } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type Props = {
    max?: number;
    total?: number;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`kumiki-avatar-group ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  :global(.kumiki-avatar-group) {
    --kumiki-avatar-group-overlap: 0.5rem;
    --kumiki-avatar-group-ring: white;

    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
  }
  :global(.kumiki-avatar-group [data-part='item']),
  :global(.kumiki-avatar-group [data-part='overflow']) {
    margin-left: calc(var(--kumiki-avatar-group-overlap) * -1);
    box-shadow: 0 0 0 2px var(--kumiki-avatar-group-ring);
    border-radius: 999px;
  }
  :global(.kumiki-avatar-group [data-part='item']:first-child),
  :global(.kumiki-avatar-group [data-part='overflow']:first-child) {
    margin-left: 0;
  }
  :global(.kumiki-avatar-group [data-part='overflow']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: hsl(220 10% 80%);
    color: hsl(220 10% 25%);
    font-size: 0.75rem;
    font-weight: 500;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-avatar-group) {
      --kumiki-avatar-group-ring: hsl(220 10% 12%);
    }
    :global(.kumiki-avatar-group [data-part='overflow']) {
      background: hsl(220 10% 35%);
      color: hsl(220 10% 80%);
    }
  }
</style>
