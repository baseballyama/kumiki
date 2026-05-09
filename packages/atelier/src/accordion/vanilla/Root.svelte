<script lang="ts" generics="V">
  import { Root } from '@kumiki/components/accordion';
  import type { Snippet } from 'svelte';
  import type { AccordionItem, AccordionMode } from '@kumiki/components/accordion';

  type Props = {
    items: ReadonlyArray<AccordionItem<V>>;
    mode?: AccordionMode;
    value?: ReadonlyArray<V> | V | null;
    defaultValue?: ReadonlyArray<V> | V | null;
    collapsible?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (expandedIds: ReadonlyArray<string>) => void;
    id?: string;
    children: Snippet;
    class?: string;
  };

  let {
    items,
    value = $bindable(undefined),
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<div class={`kumiki-accordion ${className}`.trim()}>
  <Root {items} bind:value {...rest}>{@render children()}</Root>
</div>

<style>
  :global(.kumiki-accordion) {
    --kumiki-accordion-trigger-bg: transparent;
    --kumiki-accordion-trigger-bg-hover: hsl(220 10% 96%);
    --kumiki-accordion-trigger-fg: hsl(220 10% 12%);
    --kumiki-accordion-trigger-padding: 0.75rem 1rem;
    --kumiki-accordion-content-bg: transparent;
    --kumiki-accordion-content-padding: 0 1rem 0.75rem;
    --kumiki-accordion-divider: hsl(220 10% 86%);

    border: 1px solid var(--kumiki-accordion-divider);
    border-radius: 6px;
  }
  :global(.kumiki-accordion > * + *) {
    border-top: 1px solid var(--kumiki-accordion-divider);
  }
  :global(.kumiki-accordion button[data-component-part='trigger']) {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: var(--kumiki-accordion-trigger-padding);
    border: 0;
    background: var(--kumiki-accordion-trigger-bg);
    color: var(--kumiki-accordion-trigger-fg);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
  }
  :global(.kumiki-accordion button[data-component-part='trigger']:hover) {
    background: var(--kumiki-accordion-trigger-bg-hover);
  }
  :global(.kumiki-accordion [data-component-part='panel']) {
    padding: var(--kumiki-accordion-content-padding);
    background: var(--kumiki-accordion-content-bg);
    color: hsl(220 10% 40%);
    font-size: 0.875rem;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-accordion) {
      --kumiki-accordion-trigger-bg-hover: hsl(220 10% 22%);
      --kumiki-accordion-trigger-fg: hsl(220 10% 96%);
      --kumiki-accordion-divider: hsl(220 10% 28%);
    }
    :global(.kumiki-accordion [data-component-part='panel']) {
      color: hsl(220 10% 75%);
    }
  }
</style>
