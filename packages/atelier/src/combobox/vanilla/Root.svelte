<script lang="ts" generics="T extends ComboboxOption">
  import { Root } from '@kumiki/components/combobox';
  import type { Snippet } from 'svelte';
  import type { ComboboxOption } from '@kumiki/components/combobox';

  type Props = {
    options?: ReadonlyArray<T>;
    value?: T | null;
    defaultValue?: T | null;
    defaultQuery?: string;
    disabled?: boolean;
    pageSize?: number;
    filter?: (options: ReadonlyArray<T>, query: string) => ReadonlyArray<T>;
    onValueChange?: (value: T | null) => void;
    onOpenChange?: (open: boolean) => void;
    onQueryChange?: (query: string) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<div class={`kumiki-combobox ${className}`.trim()}>
  <Root bind:value {...rest}>{@render children()}</Root>
</div>

<style>
  :global(.kumiki-combobox) {
    --kumiki-combobox-bg: var(--kumiki-color-accent-fg);
    --kumiki-combobox-border: var(--kumiki-color-line);
    --kumiki-combobox-listbox-bg: var(--kumiki-color-bg);
    --kumiki-panel-border: var(--kumiki-color-line);
    --kumiki-panel-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 8px 24px -4px color-mix(in oklab, var(--kumiki-color-accent) 12%, transparent),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 0 0 1px oklch(0 0 0 / 0.03);

    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  :global(.kumiki-combobox input) {
    height: 2.25rem;
    width: 100%;
    padding-inline: 0.75rem;
    border: 1px solid var(--kumiki-combobox-border);
    border-radius: 8px;
    background: var(--kumiki-combobox-bg);
    color: var(--kumiki-color-fg);
    font: inherit;
    font-size: 0.8125rem;
    letter-spacing: -0.005em;
    box-shadow: inset 0 1px 1px oklch(0 0 0 / 0.025);
    transition:
      border-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-combobox input::placeholder) {
    color: var(--kumiki-color-fg-quiet);
  }
  :global(.kumiki-combobox input:hover) {
    border-color: var(--kumiki-color-line-strong);
  }
  :global(.kumiki-combobox input:focus-visible) {
    outline: 0;
    border-color: var(--kumiki-color-accent);
    box-shadow:
      0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      inset 0 1px 1px oklch(0 0 0 / 0.025);
  }
  :global(.kumiki-combobox [role='listbox']) {
    z-index: 50;
    list-style: none;
    margin: 0;
    padding: 0.3125rem;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: 10px;
    background: var(--kumiki-combobox-listbox-bg);
    box-shadow: var(--kumiki-panel-shadow);
    max-height: 16rem;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--kumiki-color-line-strong) transparent;
    animation: kumiki-combobox-in 180ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  @keyframes kumiki-combobox-in {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  :global(.kumiki-combobox [role='option']) {
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
    transition: background-color 100ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-combobox [role='option'][data-active]) {
    background: var(--kumiki-menu-item-bg-active);
  }
  :global(.kumiki-combobox [role='option'][data-selected]) {
    color: var(--kumiki-color-accent);
    font-weight: 600;
  }
  :global(.kumiki-combobox [role='option'][data-selected])::after {
    content: '✓';
    margin-left: auto;
    font-weight: 700;
    color: var(--kumiki-color-accent);
  }
  :global {
    :root[data-theme='dark'] .kumiki-combobox {
      --kumiki-combobox-bg: var(--kumiki-color-surface);
      --kumiki-combobox-border: var(--kumiki-color-fg);
      --kumiki-combobox-listbox-bg: oklch(0.2 0.012 256);
      --kumiki-panel-border: var(--kumiki-color-fg);
      --kumiki-panel-shadow:
        0 1px 2px oklch(0 0 0 / 0.22), 0 8px 24px -4px oklch(0 0 0 / 0.4),
        0 16px 40px -8px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.04);
    }
    :root[data-theme='dark'] .kumiki-combobox input {
      color: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-combobox input::placeholder {
      color: var(--kumiki-color-fg-muted);
    }
    :root[data-theme='dark'] .kumiki-combobox input:focus-visible {
      border-color: var(--kumiki-color-accent);
      box-shadow:
        0 0 0 3px color-mix(in oklab, var(--kumiki-color-accent) 25%, transparent),
        inset 0 1px 1px oklch(0 0 0 / 0.1);
    }
    :root[data-theme='dark'] .kumiki-combobox [role='option'] {
      --kumiki-menu-item-bg-active: var(--kumiki-color-surface-raised);
      --kumiki-menu-item-fg: var(--kumiki-color-surface);
    }
    :root[data-theme='dark'] .kumiki-combobox [role='option'][data-selected],
    :global(:root[data-theme='dark'] .kumiki-combobox [role='option'][data-selected])::after {
      color: var(--kumiki-color-accent);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-combobox input),
    :global(.kumiki-combobox [role='listbox']),
    :global(.kumiki-combobox [role='option']) {
      transition: none;
      animation: none;
    }
  }
</style>
