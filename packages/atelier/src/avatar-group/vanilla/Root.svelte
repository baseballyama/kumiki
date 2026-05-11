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
    --kumiki-avatar-group-overlap: 0.625rem;
    --kumiki-avatar-group-ring: var(--kumiki-color-accent-fg);

    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
  }
  :global(.kumiki-avatar-group [data-component-part='item']),
  :global(.kumiki-avatar-group [data-component-part='overflow']) {
    margin-left: calc(var(--kumiki-avatar-group-overlap) * -1);
    box-shadow:
      0 0 0 2px var(--kumiki-avatar-group-ring),
      0 1px 2px oklch(0 0 0 / 0.08);
    border-radius: 999px;
    transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  :global(.kumiki-avatar-group [data-component-part='item']:hover) {
    transform: translateY(-1.5px);
    z-index: 1;
  }
  :global(.kumiki-avatar-group [data-component-part='item']:first-child),
  :global(.kumiki-avatar-group [data-component-part='overflow']:first-child) {
    margin-left: 0;
  }
  :global(.kumiki-avatar-group [data-component-part='overflow']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: oklch(0.94 0.005 247);
    color: oklch(0.42 0.014 256);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: -0.005em;
  }
  :global {
    :root[data-theme='dark'] .kumiki-avatar-group {
      --kumiki-avatar-group-ring: var(--kumiki-color-bg);
    }
    :root[data-theme='dark'] .kumiki-avatar-group [data-component-part='overflow'] {
      background: var(--kumiki-color-surface-sunken);
      color: oklch(0.82 0.008 247);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-avatar-group [data-component-part='item']),
    :global(.kumiki-avatar-group [data-component-part='overflow']) {
      transition: none;
    }
    :global(.kumiki-avatar-group [data-component-part='item']:hover) {
      transform: none;
    }
  }
</style>
