<!--
  @component @kumiki/atelier/toggle Vanilla variant — opinionated styled
  Toggle built on top of `@kumiki/components/toggle`.

  Vanilla CSS with custom properties for theming (override
  `--kumiki-toggle-*` from your global stylesheet). Copy this file into
  your project via `kumiki add toggle --variant=vanilla` (Phase 1).
-->
<script lang="ts">
  import * as Toggle from '@kumiki/components/toggle';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    defaultPressed?: boolean;
    disabled?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    id?: string;
    /** Visual size. Default: `md`. */
    size?: 'sm' | 'md' | 'lg';
    children?: Snippet;
    class?: string;
  };

  let {
    pressed = $bindable(undefined),
    defaultPressed,
    disabled,
    onPressedChange,
    id,
    size = 'md',
    children,
    class: className = '',
  }: Props = $props();
</script>

<Toggle.Root
  bind:pressed
  {defaultPressed}
  {disabled}
  {onPressedChange}
  {id}
  class={`kumiki-toggle kumiki-toggle--${size} ${className}`.trim()}
>
  {#if children}{@render children()}{/if}
</Toggle.Root>

<style>
  :global(.kumiki-toggle) {
    --kumiki-toggle-radius: 0.375rem;
    --kumiki-toggle-bg: transparent;
    --kumiki-toggle-bg-on: oklch(0.9 0 0);
    --kumiki-toggle-bg-hover: oklch(0.95 0 0);
    --kumiki-toggle-fg: inherit;
    --kumiki-toggle-fg-on: inherit;
    --kumiki-toggle-ring: oklch(0.55 0.18 252);
    --kumiki-toggle-ring-offset: oklch(1 0 0);
    --kumiki-toggle-disabled-opacity: 0.5;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: var(--kumiki-toggle-radius);
    background: var(--kumiki-toggle-bg);
    color: var(--kumiki-toggle-fg);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 120ms ease;
  }

  :global(.kumiki-toggle--sm) {
    height: 2rem;
    padding-inline: 0.5rem;
    font-size: 0.75rem;
  }
  :global(.kumiki-toggle--md) {
    height: 2.25rem;
    padding-inline: 0.75rem;
    font-size: 0.875rem;
  }
  :global(.kumiki-toggle--lg) {
    height: 2.5rem;
    padding-inline: 0.875rem;
    font-size: 1rem;
  }

  :global(.kumiki-toggle:hover:not([data-disabled])) {
    background: var(--kumiki-toggle-bg-hover);
  }
  :global(.kumiki-toggle[data-state='on']) {
    background: var(--kumiki-toggle-bg-on);
    color: var(--kumiki-toggle-fg-on);
  }
  :global(.kumiki-toggle:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-toggle-ring-offset),
      0 0 0 4px var(--kumiki-toggle-ring);
  }
  :global(.kumiki-toggle[data-disabled]) {
    opacity: var(--kumiki-toggle-disabled-opacity);
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    :global(.kumiki-toggle) {
      --kumiki-toggle-bg-on: oklch(0.3 0 0);
      --kumiki-toggle-bg-hover: oklch(0.25 0 0);
      --kumiki-toggle-ring-offset: oklch(0.18 0 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-toggle) {
      transition: none;
    }
  }
</style>
