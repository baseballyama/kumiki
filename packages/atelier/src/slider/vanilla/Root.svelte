<script lang="ts">
  import { Root } from '@kumiki/components/slider';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    orientation?: 'horizontal' | 'vertical';
    direction?: 'ltr' | 'rtl';
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<Root bind:value class={`kumiki-slider ${className}`.trim()} {...rest}>
  {@render children()}
</Root>

<style>
  /* ─── Tokens ───────────────────────────────────────────────────────────
     朱 (vermillion) accent on the filled range, parchment-grey on the
     unfilled track. The headless Root attachment paints
     `--kumiki-slider-pct` on this element each tick — we use it both to
     draw the filled range as a background gradient (no extra DOM) and
     to position the thumb. */
  :global(.kumiki-slider) {
    --kumiki-slider-track-bg: var(--kumiki-color-line);
    --kumiki-slider-range-bg: var(--kumiki-color-accent);
    --kumiki-slider-range-bg-soft: oklch(0.7 0.18 35);
    --kumiki-slider-thumb-bg: var(--kumiki-color-accent-fg);
    --kumiki-slider-thumb-border: var(--kumiki-color-accent);
    --kumiki-slider-thumb-size: 1.125rem;
    --kumiki-slider-track-height: 0.375rem;
    --kumiki-slider-outline-focus: var(--kumiki-color-accent);
    --kumiki-slider-pct: 0%;

    position: relative;
    width: 100%;
    height: var(--kumiki-slider-track-height);
    border-radius: 999px;
    background: linear-gradient(
      to right,
      var(--kumiki-slider-range-bg) 0%,
      var(--kumiki-slider-range-bg-soft) var(--kumiki-slider-pct),
      var(--kumiki-slider-track-bg) var(--kumiki-slider-pct),
      var(--kumiki-slider-track-bg) 100%
    );
    box-shadow: inset 0 1px 1px oklch(0 0 0 / 0.06);
    touch-action: none;
    cursor: pointer;
  }
  :global(.kumiki-slider[data-orientation='vertical']) {
    width: var(--kumiki-slider-track-height);
    height: 100%;
    background: linear-gradient(
      to top,
      var(--kumiki-slider-range-bg) 0%,
      var(--kumiki-slider-range-bg-soft) var(--kumiki-slider-pct),
      var(--kumiki-slider-track-bg) var(--kumiki-slider-pct),
      var(--kumiki-slider-track-bg) 100%
    );
  }
  :global(.kumiki-slider[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ─── Thumb ─────────────────────────────────────────────────────────
     Positioned absolutely at the percentage point; transform centres
     it on the track. */
  :global(.kumiki-slider [data-component-part='thumb']) {
    position: absolute;
    top: 50%;
    left: var(--kumiki-slider-pct, 0%);
    transform: translate(-50%, -50%);
    display: block;
    width: var(--kumiki-slider-thumb-size);
    height: var(--kumiki-slider-thumb-size);
    border: 0;
    border-radius: 50%;
    background: var(--kumiki-slider-thumb-bg);
    box-shadow:
      0 1px 3px oklch(0 0 0 / 0.22),
      0 1px 2px oklch(0 0 0 / 0.06),
      inset 0 0 0 1.5px var(--kumiki-slider-thumb-border);
    cursor: grab;
    transition:
      transform 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-slider[data-orientation='vertical'] [data-component-part='thumb']) {
    top: var(--kumiki-slider-pct, 0%);
    left: 50%;
  }
  :global(.kumiki-slider [data-component-part='thumb']:hover) {
    transform: translate(-50%, -50%) scale(1.08);
  }
  :global(.kumiki-slider[data-orientation='vertical'] [data-component-part='thumb']:hover) {
    transform: translate(-50%, -50%) scale(1.08);
  }
  :global(.kumiki-slider [data-component-part='thumb']:active) {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.12);
    box-shadow:
      0 2px 6px oklch(0 0 0 / 0.24),
      0 1px 2px oklch(0 0 0 / 0.08),
      inset 0 0 0 1.5px var(--kumiki-slider-thumb-border),
      0 0 0 4px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent);
  }
  :global(.kumiki-slider [data-component-part='thumb']:focus-visible) {
    outline: 0;
    box-shadow:
      0 1px 3px oklch(0 0 0 / 0.22),
      inset 0 0 0 1.5px var(--kumiki-slider-thumb-border),
      0 0 0 2px var(--kumiki-color-accent-fg),
      0 0 0 4px var(--kumiki-slider-outline-focus);
  }

  /* ─── Dark theme ──────────────────────────────────────────────────── */
  :global {
    :root[data-theme='dark'] .kumiki-slider {
      --kumiki-slider-track-bg: var(--kumiki-color-surface-sunken);
      --kumiki-slider-range-bg: var(--kumiki-color-accent);
      --kumiki-slider-range-bg-soft: var(--kumiki-color-accent-hover);
      --kumiki-slider-thumb-bg: var(--kumiki-color-surface);
      --kumiki-slider-thumb-border: var(--kumiki-color-accent);
      --kumiki-slider-outline-focus: var(--kumiki-color-accent);
    }
    :root[data-theme='dark'] .kumiki-slider [data-component-part='thumb']:focus-visible {
      box-shadow:
        0 1px 3px oklch(0 0 0 / 0.34),
        inset 0 0 0 1.5px var(--kumiki-slider-thumb-border),
        0 0 0 2px var(--kumiki-color-bg),
        0 0 0 4px var(--kumiki-slider-outline-focus);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-slider [data-component-part='thumb']) {
      transition: none;
    }
  }
</style>
