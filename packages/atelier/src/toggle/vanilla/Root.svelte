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
  {#if children}<span class="kumiki-toggle__content">{@render children()}</span>{/if}
</Toggle.Root>

<style>
  :global(.kumiki-toggle) {
    --kumiki-toggle-radius: 8px;
    --kumiki-toggle-bg: transparent;
    --kumiki-toggle-bg-on: var(--kumiki-color-fg);
    --kumiki-toggle-bg-hover: var(--kumiki-color-surface);
    --kumiki-toggle-fg: var(--kumiki-color-fg);
    --kumiki-toggle-fg-on: var(--kumiki-color-accent-fg);
    --kumiki-toggle-border: transparent;
    --kumiki-toggle-padding-x: 0.75rem;
    --kumiki-toggle-padding-y: 0;
    --kumiki-toggle-ring: var(--kumiki-color-accent);
    --kumiki-toggle-ring-offset: var(--kumiki-color-accent-fg);
    --kumiki-toggle-disabled-opacity: 0.5;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--kumiki-toggle-border);
    border-radius: var(--kumiki-toggle-radius);
    padding-inline: var(--kumiki-toggle-padding-x);
    padding-block: var(--kumiki-toggle-padding-y);
    background: var(--kumiki-toggle-bg);
    color: var(--kumiki-toggle-fg);
    font: inherit;
    font-weight: 550;
    letter-spacing: -0.005em;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-toggle__content) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4375rem;
    line-height: 1;
    /* Trim ascender/descender so the visual ink (cap → baseline) drives the
       flex centering, eliminating the optical "text shifted down" effect on
       fonts with tall ascenders like DM Sans / Inter / system-ui. Falls back
       gracefully on older browsers (still flex-centered, ~1px sub-optimal). */
    text-box: trim-both cap alphabetic;
  }
  :global(.kumiki-toggle__content > *) {
    flex-shrink: 0;
  }

  :global(.kumiki-toggle--sm) {
    height: 2rem;
    --kumiki-toggle-padding-x: 0.625rem;
    --kumiki-toggle-radius: 7px;
    font-size: 0.75rem;
  }
  :global(.kumiki-toggle--md) {
    height: 2.25rem;
    --kumiki-toggle-padding-x: 0.75rem;
    font-size: 0.8125rem;
  }
  :global(.kumiki-toggle--lg) {
    height: 2.5rem;
    --kumiki-toggle-padding-x: 1rem;
    --kumiki-toggle-radius: 9px;
    font-size: 0.9375rem;
  }

  :global(.kumiki-toggle:hover:not([data-disabled])) {
    background: var(--kumiki-toggle-bg-hover);
  }
  :global(.kumiki-toggle[data-state='on']) {
    background: var(--kumiki-toggle-bg-on);
    color: var(--kumiki-toggle-fg-on);
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.12),
      inset 0 1px 0 oklch(1 0 0 / 0.08);
  }
  :global(.kumiki-toggle[data-state='on']:hover:not([data-disabled])) {
    background: oklch(0.28 0.02 256);
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

  :global {
    :root[data-theme='dark'] .kumiki-toggle {
      --kumiki-toggle-bg-on: var(--kumiki-color-surface);
      --kumiki-toggle-fg: var(--kumiki-color-fg-muted);
      --kumiki-toggle-fg-on: var(--kumiki-color-bg);
      --kumiki-toggle-bg-hover: var(--kumiki-color-surface-raised);
      --kumiki-toggle-ring: var(--kumiki-color-accent);
      --kumiki-toggle-ring-offset: var(--kumiki-color-bg);
    }
    :root[data-theme='dark'] .kumiki-toggle[data-state='on']:hover:not([data-disabled]) {
      background: oklch(0.88 0.005 247);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-toggle) {
      transition: none;
    }
  }
</style>
