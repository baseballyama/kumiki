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
    --kumiki-accordion-trigger-bg-hover: var(--kumiki-color-surface);
    --kumiki-accordion-trigger-fg: var(--kumiki-color-fg);
    --kumiki-accordion-trigger-padding: 0.875rem 1.125rem;
    --kumiki-accordion-content-bg: transparent;
    --kumiki-accordion-content-padding: 0 1.125rem 1rem;
    --kumiki-accordion-divider: var(--kumiki-color-line);

    border: 1px solid var(--kumiki-accordion-divider);
    border-radius: 12px;
    overflow: hidden;
    background: var(--kumiki-color-bg);
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
    font-weight: 550;
    letter-spacing: -0.005em;
    text-align: left;
    cursor: pointer;
    transition: background-color 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-accordion button[data-component-part='trigger']:hover) {
    background: var(--kumiki-accordion-trigger-bg-hover);
  }
  :global(.kumiki-accordion button[data-component-part='trigger']:focus-visible) {
    outline: 0;
    box-shadow: inset 0 0 0 2px var(--kumiki-color-accent);
  }
  :global(.kumiki-accordion button[data-component-part='trigger'])::after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg) translateY(-2px);
    opacity: 0.5;
    transition: transform 220ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-accordion button[data-component-part='trigger'][aria-expanded='true'])::after {
    transform: rotate(-135deg) translateY(-2px);
  }
  :global(.kumiki-accordion [data-component-part='panel']) {
    padding: var(--kumiki-accordion-content-padding);
    background: var(--kumiki-accordion-content-bg);
    color: var(--kumiki-color-fg-muted);
    font-size: 0.8125rem;
    line-height: 1.55;
    letter-spacing: -0.005em;
  }
  :global {
    /* Dark mode is driven exclusively by the consumer's explicit
       `data-theme="dark"` on `<html>`. We deliberately do NOT auto-switch on
       `prefers-color-scheme: dark` so a consumer that pins their site to
       light (e.g. via a theme toggle) sees this component stay in light too. */
    :root[data-theme='dark'] .kumiki-accordion {
      --kumiki-accordion-trigger-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-accordion-trigger-fg: var(--kumiki-color-surface);
      --kumiki-accordion-divider: var(--kumiki-color-fg);
      background: oklch(0.2 0.012 256);
    }
    :root[data-theme='dark'] .kumiki-accordion [data-component-part='panel'] {
      color: var(--kumiki-color-fg-quiet);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-accordion button[data-component-part='trigger']),
    :global(.kumiki-accordion button[data-component-part='trigger'])::after {
      transition: none;
    }
  }
</style>
