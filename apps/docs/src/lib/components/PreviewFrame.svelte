<!--
  Wraps a live demo in a LocaleProvider whose locale and direction track
  the global UI store. Loads the matching `@kumiki/locale/<lang>` bundle
  on demand so we don't bloat the initial JS for visitors who never
  switch language.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { LocaleProvider } from '@kumiki/components';
  import type { Messages } from '@kumiki/locale';

  let { children }: { children: Snippet } = $props();

  // Default English bundle so SSR has *something* to render with.
  let messages = $state<Messages | null>(null);
  let loadedLocale = $state<string | null>(null);

  const localeLoaders: Record<string, () => Promise<{ messages: Messages }>> = {
    en: () => import('@kumiki/locale/en'),
    ja: () => import('@kumiki/locale/ja'),
    'zh-Hans': () => import('@kumiki/locale/zh-Hans'),
    'zh-Hant': () => import('@kumiki/locale/zh-Hant'),
    ko: () => import('@kumiki/locale/ko'),
    es: () => import('@kumiki/locale/es'),
    fr: () => import('@kumiki/locale/fr'),
    de: () => import('@kumiki/locale/de'),
    ar: () => import('@kumiki/locale/ar'),
    he: () => import('@kumiki/locale/he'),
  };

  $effect(() => {
    const loader = localeLoaders[ui.locale] ?? localeLoaders.en;
    if (!loader) return;
    loader().then((mod) => {
      if (ui.locale === loadedLocale) return;
      messages = mod.messages;
      loadedLocale = ui.locale;
    });
  });
</script>

<div class="frame" data-direction={ui.direction}>
  <div class="grid" aria-hidden="true"></div>
  {#if messages}
    <LocaleProvider.Root locale={ui.locale} {messages} dir={ui.direction}>
      <div class="canvas">
        {@render children()}
      </div>
    </LocaleProvider.Root>
  {:else}
    <div class="canvas">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .frame {
    position: relative;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    min-height: 280px;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 32px;
  }
  .grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, var(--k-line-1) 1px, transparent 1px),
      linear-gradient(to bottom, var(--k-line-1) 1px, transparent 1px);
    background-size: 32px 32px;
    opacity: 0.35;
    pointer-events: none;
    mask-image: radial-gradient(circle at center, black 0, transparent 75%);
  }
  .canvas {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 640px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /*
   * Legacy demo style normaliser. Existing demos (predating the docs-site
   * redesign) use a dark hardcoded palette that clashes on the light theme.
   * Map the most common hex values onto the current theme tokens via a
   * cascading override — minimally invasive and lets us update demos at
   * leisure without breaking the doc UI.
   */
  .canvas :global(.demo) {
    background: var(--k-surface-0) !important;
    border: 1px solid var(--k-line-1) !important;
    border-radius: var(--k-radius-md) !important;
    color: var(--k-ink-2);
  }
  .canvas :global(button[aria-pressed]),
  .canvas :global(button[role='switch']) {
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    padding: 10px 18px;
    font: inherit;
    cursor: pointer;
    min-width: 80px;
    transition:
      background 120ms,
      border-color 120ms;
  }
  .canvas :global(button[aria-pressed='true']),
  .canvas :global(button[role='switch'][aria-checked='true']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
    color: white;
  }
  .canvas :global(button[aria-disabled='true']),
  .canvas :global([data-disabled]) {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .canvas :global(input[type='checkbox']),
  .canvas :global(input[type='radio']) {
    accent-color: var(--k-shu);
  }
  .canvas :global(.state),
  .canvas :global(.meta) {
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .canvas :global(.state code) {
    color: var(--k-matcha-ink);
  }
  .canvas :global(.log) {
    background: var(--k-code-bg) !important;
    border: 1px solid var(--k-code-line) !important;
    color: var(--k-ink-3) !important;
  }
  .canvas :global(label.control) {
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .canvas :global(button.ext) {
    color: var(--k-ink-2);
    border-color: var(--k-line-2) !important;
    background: transparent !important;
  }
  .canvas :global(code) {
    background: transparent;
    border: 0;
    padding: 0;
    color: inherit;
    font-size: 0.85em;
  }
</style>
