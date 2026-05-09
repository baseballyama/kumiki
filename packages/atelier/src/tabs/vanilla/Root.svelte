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
    --kumiki-tabs-list-border: hsl(220 10% 86%);
    --kumiki-tabs-trigger-fg: hsl(220 10% 45%);
    --kumiki-tabs-trigger-fg-active: hsl(220 10% 12%);
    --kumiki-tabs-trigger-indicator-bg: hsl(220 10% 12%);
    --kumiki-tabs-trigger-padding-x: 0.75rem;
    --kumiki-tabs-trigger-padding-y: 0.375rem;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  :global(.kumiki-tabs [role='tablist']) {
    display: inline-flex;
    align-items: center;
    border-bottom: 1px solid var(--kumiki-tabs-list-border);
  }
  :global(.kumiki-tabs [role='tab']) {
    display: inline-flex;
    align-items: center;
    padding: var(--kumiki-tabs-trigger-padding-y) var(--kumiki-tabs-trigger-padding-x);
    margin-bottom: -1px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--kumiki-tabs-trigger-fg);
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 120ms ease;
  }
  :global(.kumiki-tabs [role='tab']:hover) {
    color: var(--kumiki-tabs-trigger-fg-active);
  }
  :global(.kumiki-tabs [role='tab'][data-state='active']) {
    color: var(--kumiki-tabs-trigger-fg-active);
    border-bottom-color: var(--kumiki-tabs-trigger-indicator-bg);
  }
  :global(.kumiki-tabs [role='tab'][aria-disabled='true']) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  @media (prefers-color-scheme: dark) {
    :global(.kumiki-tabs) {
      --kumiki-tabs-list-border: hsl(220 10% 28%);
      --kumiki-tabs-trigger-fg: hsl(220 10% 65%);
      --kumiki-tabs-trigger-fg-active: hsl(220 10% 96%);
      --kumiki-tabs-trigger-indicator-bg: hsl(220 10% 96%);
    }
  }
</style>
