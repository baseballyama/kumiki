<!--
  Lazy-mounted thumbnail of a real Kumiki demo, scaled down inside a
  fixed-size frame. Pointer events are disabled — the thumb is purely
  visual; the surrounding card handles the click.
-->
<script lang="ts">
  import type { Component } from 'svelte';
  import { LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';

  type Props = {
    slug: string;
    /**
     * Hard cap for the auto-fit scale. We never scale UP beyond this even if
     * the demo is tiny — keeps single-button thumbnails from looking inflated.
     */
    maxScale?: number;
    /** Inner padding (px) inside the frame when computing the auto-fit scale. */
    pad?: number;
  };
  let { slug, maxScale = 0.7, pad = 8 }: Props = $props();

  /**
   * Components whose `live` demo only shows a trigger (Dialog, Tooltip, …)
   * have a dedicated thumbnail preview that mocks the open state visually.
   * Looked up by the base name (atelier-tooltip → tooltip).
   */
  const THUMB_PREVIEWS: Record<string, () => Promise<{ default: Component }>> = {
    dialog: () => import('$lib/playgrounds/thumb-previews/dialog.svelte'),
    tooltip: () => import('$lib/playgrounds/thumb-previews/tooltip.svelte'),
    popover: () => import('$lib/playgrounds/thumb-previews/popover.svelte'),
    menu: () => import('$lib/playgrounds/thumb-previews/menu.svelte'),
    toast: () => import('$lib/playgrounds/thumb-previews/toast.svelte'),
    'icon-button': () => import('$lib/playgrounds/thumb-previews/icon-button.svelte'),
    toolbar: () => import('$lib/playgrounds/thumb-previews/toolbar.svelte'),
    accordion: () => import('$lib/playgrounds/thumb-previews/accordion.svelte'),
  };

  const baseName = $derived(slug.replace(/^(component|atelier|attachment|machine)-/, ''));

  let containerEl: HTMLDivElement | null = $state(null);
  let frameEl: HTMLDivElement | null = $state(null);
  let scaleEl: HTMLDivElement | null = $state(null);
  let DemoComponent: Component | undefined = $state(undefined);
  let visible = $state(false);
  let computedScale = $state(0.45);

  $effect(() => {
    if (!containerEl) return;
    if (typeof IntersectionObserver === 'undefined') {
      visible = true;
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible = true;
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: '300px 0px' },
    );
    obs.observe(containerEl);
    return () => obs.disconnect();
  });

  $effect(() => {
    if (!visible) return;
    const preview = THUMB_PREVIEWS[baseName];
    // For thumbnail purposes prefer the visually richest version: a custom
    // preview if one exists, then the Atelier demo (Layer 5, styled), then
    // the originally requested slug, then any sibling at a lower Layer.
    const loader =
      preview ??
      LIVE_PLAYGROUNDS[`atelier-${baseName}`] ??
      LIVE_PLAYGROUNDS[slug] ??
      LIVE_PLAYGROUNDS[`component-${baseName}`] ??
      LIVE_PLAYGROUNDS[`attachment-${baseName}`];
    if (!loader) return;
    loader().then(
      (mod) => {
        DemoComponent = mod.default as Component;
      },
      () => {
        DemoComponent = undefined;
      },
    );
  });

  // Auto-fit: measure the demo at intrinsic size and pick the scale that
  // fills the frame without overflowing in either axis. Capped by maxScale
  // so a tiny demo (a single button, a spinner) doesn't get inflated.
  $effect(() => {
    if (!frameEl || !scaleEl || !DemoComponent) return;

    const fit = () => {
      if (!frameEl || !scaleEl) return;
      const fw = frameEl.clientWidth;
      const fh = frameEl.clientHeight;
      // Measure intrinsic content size by taking the unscaled bounding box
      // of the inner element. scaleEl uses width: max-content so this is
      // its natural width; we read offsetWidth/Height which ignore CSS
      // transforms.
      const cw = scaleEl.offsetWidth;
      const ch = scaleEl.offsetHeight;
      if (!cw || !ch) return;
      const sx = (fw - pad * 2) / cw;
      const sy = (fh - pad * 2) / ch;
      const next = Math.min(sx, sy, maxScale);
      if (next > 0 && Number.isFinite(next)) {
        computedScale = next;
      }
    };

    // Run once after mount, then again whenever the frame or demo resizes.
    requestAnimationFrame(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(frameEl);
    ro.observe(scaleEl);
    return () => ro.disconnect();
  });
</script>

<div class="thumb" bind:this={containerEl} data-slug={slug}>
  <div class="frame" bind:this={frameEl} inert>
    {#if DemoComponent}
      <div class="scale" bind:this={scaleEl} style:--s={computedScale}>
        <DemoComponent />
      </div>
    {/if}
  </div>
  <div class="grid-overlay" aria-hidden="true"></div>
</div>

<style>
  .thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 7 / 5;
    background: var(--k-surface-1);
    border-radius: var(--k-radius-xs);
    overflow: hidden;
    isolation: isolate;
    contain: paint;
  }
  .frame {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }
  .scale {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%) scale(var(--s));
    transform-origin: center;
    /* Fixed reference width so demos with long copy wrap predictably and the
       auto-fit scale has something stable to measure against. The frame still
       clips anything that overflows. */
    width: 360px;
    pointer-events: none;
  }
  /* Neutralize the heavy padding / border baked into demo wrappers — the
     thumb is its own frame. Demos typically wrap their content in `.demo`. */
  .scale :global(.demo) {
    background: transparent !important;
    border: 0 !important;
    padding: 12px !important;
    box-shadow: none !important;
    /* Demos set generous min-heights and fixed widths so their expanded
       state has room. For thumbnails we want the content to fit its
       intrinsic size against the `.scale` reference width — the auto-fit
       calculation then scales to fill the frame instead of measuring
       against a reserved box. */
    min-height: 0 !important;
    width: 100% !important;
  }
  .grid-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(var(--k-line-1), var(--k-line-1)) center / 100% 1px no-repeat,
      linear-gradient(var(--k-line-1), var(--k-line-1)) center / 1px 100% no-repeat;
    opacity: 0.35;
    mix-blend-mode: multiply;
  }
  :global(html[data-theme='dark']) .grid-overlay {
    opacity: 0.5;
    mix-blend-mode: screen;
  }
</style>
