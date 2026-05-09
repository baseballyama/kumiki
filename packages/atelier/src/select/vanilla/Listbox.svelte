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
    --kumiki-combobox-listbox-bg: white;
    --kumiki-panel-border: hsl(220 10% 86%);
    --kumiki-panel-shadow: 0 8px 24px hsl(0 0% 0% / 0.12);

    z-index: 50;
    min-width: 10rem;
    list-style: none;
    overflow: auto;
    padding: 0.25rem;
    margin: 0;
    border: 1px solid var(--kumiki-panel-border);
    border-radius: 6px;
    background: var(--kumiki-combobox-listbox-bg);
    box-shadow: var(--kumiki-panel-shadow);
    outline: none;
  }
  :global(.kumiki-select-listbox [role='option']) {
    --kumiki-menu-item-bg-active: hsl(220 10% 92%);
    --kumiki-menu-item-fg: hsl(220 10% 12%);

    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: 4px;
    color: var(--kumiki-menu-item-fg);
    font-size: 0.875rem;
    cursor: default;
    user-select: none;
  }
  :global(.kumiki-select-listbox [role='option'][data-active]) {
    background: var(--kumiki-menu-item-bg-active);
  }
  :global(.kumiki-select-listbox [role='option'][data-selected]) {
    font-weight: 600;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-select-listbox) {
      --kumiki-combobox-listbox-bg: hsl(220 10% 14%);
      --kumiki-panel-border: hsl(220 10% 28%);
    }
    :global(.kumiki-select-listbox [role='option']) {
      --kumiki-menu-item-bg-active: hsl(220 10% 22%);
      --kumiki-menu-item-fg: hsl(220 10% 96%);
    }
  }
</style>
