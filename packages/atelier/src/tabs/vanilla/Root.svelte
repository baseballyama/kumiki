<script lang="ts">
  import { Root } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';
  import type {
    TabItem,
    TabsActivation,
    TabsOrientation,
    TabsDirection,
  } from '@kumiki/components/tabs';

  type Props = {
    items: ReadonlyArray<TabItem>;
    value?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    activation?: TabsActivation;
    orientation?: TabsOrientation;
    direction?: TabsDirection;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: string | null) => void;
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

<div class={`kumiki-tabs ${className}`.trim()}>
  <Root {items} bind:value {...rest}>{@render children()}</Root>
</div>

<style>
  :global(.kumiki-tabs) {
    --kumiki-tabs-list-border: var(--kumiki-color-line);
    --kumiki-tabs-trigger-fg: var(--kumiki-color-fg-muted);
    --kumiki-tabs-trigger-fg-active: var(--kumiki-color-fg);
    --kumiki-tabs-trigger-indicator-bg: var(--kumiki-color-accent);
    --kumiki-tabs-trigger-padding-x: 0.875rem;
    --kumiki-tabs-trigger-padding-y: 0.5rem;

    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
  :global(.kumiki-tabs [role='tablist']) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-bottom: 1px solid var(--kumiki-tabs-list-border);
  }
  :global(.kumiki-tabs [role='tab']) {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: var(--kumiki-tabs-trigger-padding-y) var(--kumiki-tabs-trigger-padding-x);
    margin-bottom: -1px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--kumiki-tabs-trigger-fg);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 550;
    letter-spacing: -0.005em;
    cursor: pointer;
    transition: color 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-tabs [role='tab']:hover) {
    color: var(--kumiki-tabs-trigger-fg-active);
  }
  :global(.kumiki-tabs [role='tab'][data-state='active']) {
    color: var(--kumiki-tabs-trigger-indicator-bg);
    border-bottom-color: var(--kumiki-tabs-trigger-indicator-bg);
  }
  :global(.kumiki-tabs [role='tab']:focus-visible) {
    outline: 0;
    border-radius: 6px;
    box-shadow:
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-color-accent);
  }
  :global(.kumiki-tabs [role='tab'][aria-disabled='true']) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :global {
    :root[data-theme='dark'] .kumiki-tabs {
      --kumiki-tabs-list-border: var(--kumiki-color-fg);
      --kumiki-tabs-trigger-fg: oklch(0.65 0.012 256);
      --kumiki-tabs-trigger-fg-active: var(--kumiki-color-surface);
      --kumiki-tabs-trigger-indicator-bg: var(--kumiki-color-accent);
    }
    :root[data-theme='dark'] .kumiki-tabs [role='tab']:focus-visible {
      box-shadow:
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-color-accent);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-tabs [role='tab']) {
      transition: none;
    }
  }
</style>
