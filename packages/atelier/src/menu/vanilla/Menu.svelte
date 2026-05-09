<script lang="ts">
  import { Menu } from '@kumiki/components/menu';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Menu class={`kumiki-menu ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Menu>

<style>
  :global(.kumiki-menu) {
    --kumiki-menu-bg: white;
    --kumiki-panel-border: hsl(220 10% 86%);
    --kumiki-panel-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);

    z-index: 50;
    min-width: 10rem;
    padding: 0.25rem;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: 6px;
    background: var(--kumiki-menu-bg);
    box-shadow: var(--kumiki-panel-shadow);
    outline: none;
  }
  :global(.kumiki-menu [data-component-part='item']) {
    --kumiki-menu-item-bg: transparent;
    --kumiki-menu-item-bg-active: hsl(220 10% 92%);
    --kumiki-menu-item-fg: hsl(220 10% 12%);
    --kumiki-menu-item-padding: 0.375rem 0.5rem;

    display: flex;
    align-items: center;
    padding: var(--kumiki-menu-item-padding);
    border-radius: 4px;
    background: var(--kumiki-menu-item-bg);
    color: var(--kumiki-menu-item-fg);
    font-size: 0.875rem;
    cursor: default;
    user-select: none;
    outline: none;
  }
  :global(.kumiki-menu [data-component-part='item'][data-active]) {
    background: var(--kumiki-menu-item-bg-active);
  }
  :global(.kumiki-menu [data-component-part='item'][data-disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
  :global(.kumiki-menu [data-component-part='separator']) {
    height: 1px;
    margin-block: 0.25rem;
    background: hsl(220 10% 86%);
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-menu) {
      --kumiki-menu-bg: hsl(220 10% 14%);
      --kumiki-panel-border: hsl(220 10% 28%);
    }
    :global(.kumiki-menu [data-component-part='item']) {
      --kumiki-menu-item-fg: hsl(220 10% 96%);
      --kumiki-menu-item-bg-active: hsl(220 10% 22%);
    }
    :global(.kumiki-menu [data-component-part='separator']) {
      background: hsl(220 10% 28%);
    }
  }
</style>
