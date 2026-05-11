<script lang="ts" generics="V">
  import { Listbox } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Listbox class={`kumiki-select-listbox ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Listbox>

<style>
  :global(.kumiki-select-listbox) {
    --kumiki-combobox-listbox-bg: var(--kumiki-color-bg);
    --kumiki-panel-border: var(--kumiki-color-line);
    --kumiki-panel-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 8px 24px -4px color-mix(in oklab, var(--kumiki-color-accent) 12%, transparent),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 0 0 1px oklch(0 0 0 / 0.03);

    z-index: 50;
    min-width: 11rem;
    list-style: none;
    overflow: auto;
    padding: 0.3125rem;
    margin: 0;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: 10px;
    background: var(--kumiki-combobox-listbox-bg);
    box-shadow: var(--kumiki-panel-shadow);
    outline: none;
    scrollbar-width: thin;
    scrollbar-color: var(--kumiki-color-line-strong) transparent;
    animation: kumiki-select-listbox-in 180ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  @keyframes kumiki-select-listbox-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  :global(.kumiki-select-listbox [role='option']) {
    --kumiki-menu-item-bg-active: var(--kumiki-color-surface);
    --kumiki-menu-item-fg: var(--kumiki-color-fg);

    display: flex;
    align-items: center;
    padding: 0.4375rem 0.625rem;
    border-radius: 6px;
    color: var(--kumiki-menu-item-fg);
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: -0.005em;
    cursor: default;
    user-select: none;
    transition: background-color 100ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-select-listbox [role='option'][data-active]) {
    background: var(--kumiki-menu-item-bg-active);
  }
  :global(.kumiki-select-listbox [role='option'][data-selected]) {
    color: var(--kumiki-color-accent);
    font-weight: 600;
  }
  :global(.kumiki-select-listbox [role='option'][data-selected])::after {
    content: '✓';
    margin-left: auto;
    font-weight: 700;
    color: var(--kumiki-color-accent);
  }
  :global {
    :root[data-theme='dark'] .kumiki-select-listbox {
      --kumiki-combobox-listbox-bg: oklch(0.2 0.012 256);
      --kumiki-panel-border: var(--kumiki-color-fg);
      --kumiki-panel-shadow:
        0 1px 2px oklch(0 0 0 / 0.22), 0 8px 24px -4px oklch(0 0 0 / 0.4),
        0 16px 40px -8px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.04);
    }
    :root[data-theme='dark'] .kumiki-select-listbox [role='option'] {
      --kumiki-menu-item-bg-active: var(--kumiki-color-surface-raised);
      --kumiki-menu-item-fg: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-select-listbox [role='option'][data-selected],
    :global(:root[data-theme='dark'] .kumiki-select-listbox [role='option'][data-selected])::after {
      color: var(--kumiki-color-accent);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-select-listbox),
    :global(.kumiki-select-listbox [role='option']) {
      animation: none;
      transition: none;
    }
  }
</style>
