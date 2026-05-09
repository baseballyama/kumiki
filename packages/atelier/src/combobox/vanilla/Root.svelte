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
    --kumiki-combobox-bg: white;
    --kumiki-combobox-border: hsl(220 10% 80%);
    --kumiki-combobox-listbox-bg: white;
    --kumiki-panel-border: hsl(220 10% 86%);
    --kumiki-panel-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);

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
    border-radius: 6px;
    background: var(--kumiki-combobox-bg);
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
  }
  :global(.kumiki-combobox [role='listbox']) {
    z-index: 50;
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: 6px;
    background: var(--kumiki-combobox-listbox-bg);
    box-shadow: var(--kumiki-panel-shadow);
    max-height: 16rem;
    overflow: auto;
  }
  :global(.kumiki-combobox [role='option']) {
    --kumiki-menu-item-bg-active: hsl(220 10% 92%);
    --kumiki-menu-item-fg: hsl(220 10% 12%);

    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: 4px;
    color: var(--kumiki-menu-item-fg);
    font-size: 0.875rem;
    cursor: default;
  }
  :global(.kumiki-combobox [role='option'][data-active]) {
    background: var(--kumiki-menu-item-bg-active);
  }
  :global(.kumiki-combobox [role='option'][data-selected]) {
    font-weight: 600;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-combobox) {
      --kumiki-combobox-bg: hsl(220 10% 14%);
      --kumiki-combobox-border: hsl(220 10% 28%);
      --kumiki-combobox-listbox-bg: hsl(220 10% 14%);
      --kumiki-panel-border: hsl(220 10% 28%);
    }
    :global(.kumiki-combobox [role='option']) {
      --kumiki-menu-item-bg-active: hsl(220 10% 22%);
      --kumiki-menu-item-fg: hsl(220 10% 96%);
    }
  }
</style>
