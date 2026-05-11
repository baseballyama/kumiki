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
    --kumiki-menu-bg: var(--kumiki-color-bg);
    --kumiki-panel-border: var(--kumiki-color-line);
    --kumiki-panel-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 8px 24px -4px color-mix(in oklab, var(--kumiki-color-accent) 12%, transparent),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 0 0 1px oklch(0 0 0 / 0.03);

    z-index: 50;
    min-width: 11rem;
    padding: 0.3125rem;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: 10px;
    background: var(--kumiki-menu-bg);
    box-shadow: var(--kumiki-panel-shadow);
    outline: none;
    animation: kumiki-menu-in 180ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-menu[data-state='closed']) {
    animation: kumiki-menu-out 120ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
  @keyframes kumiki-menu-in {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  @keyframes kumiki-menu-out {
    to {
      opacity: 0;
      transform: scale(0.97) translateY(-2px);
    }
  }
  :global(.kumiki-menu [data-component-part='item']) {
    --kumiki-menu-item-bg: transparent;
    --kumiki-menu-item-bg-active: var(--kumiki-color-surface);
    --kumiki-menu-item-fg: var(--kumiki-color-fg);
    --kumiki-menu-item-padding: 0.4375rem 0.625rem;

    display: flex;
    align-items: center;
    padding: var(--kumiki-menu-item-padding);
    border-radius: 6px;
    background: var(--kumiki-menu-item-bg);
    color: var(--kumiki-menu-item-fg);
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: -0.005em;
    cursor: default;
    user-select: none;
    outline: none;
    transition: background-color 120ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-menu [data-component-part='item'][data-active]) {
    background: var(--kumiki-menu-item-bg-active);
  }
  :global(.kumiki-menu [data-component-part='item'][data-disabled]) {
    opacity: 0.45;
    pointer-events: none;
  }
  :global(.kumiki-menu [data-component-part='separator']) {
    height: 1px;
    margin-block: 0.3125rem;
    margin-inline: -0.0625rem;
    background: var(--kumiki-color-line);
  }
  :global {
    :root[data-theme='dark'] .kumiki-menu {
      --kumiki-menu-bg: oklch(0.2 0.012 256);
      --kumiki-panel-border: var(--kumiki-color-fg);
      --kumiki-panel-shadow:
        0 1px 2px oklch(0 0 0 / 0.22), 0 8px 24px -4px oklch(0 0 0 / 0.4),
        0 16px 40px -8px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.04);
    }
    :root[data-theme='dark'] .kumiki-menu [data-component-part='item'] {
      --kumiki-menu-item-fg: var(--kumiki-color-surface);
      --kumiki-menu-item-bg-active: var(--kumiki-color-surface-raised);
    }
    :root[data-theme='dark'] .kumiki-menu [data-component-part='separator'] {
      background: var(--kumiki-color-surface-sunken);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-menu),
    :global(.kumiki-menu[data-state='closed']),
    :global(.kumiki-menu [data-component-part='item']) {
      animation: none;
      transition: none;
    }
  }
</style>
