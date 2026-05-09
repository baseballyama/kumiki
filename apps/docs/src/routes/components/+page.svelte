<!--
  Components catalog. Storybook-like grid of every Layer 4 / Layer 5 entry,
  with category and status filters, plus a live "thumb" preview.
-->
<script lang="ts">
  import { PLAYGROUNDS } from '$lib/playgrounds/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';
  import StatusBadge from '$lib/components/StatusBadge.svelte';

  const t = $derived(dict(ui.locale).components);

  const catalogue = PLAYGROUNDS.filter((p) => p.layer >= 3);

  let query = $state('');
  let layerFilter = $state<'all' | 3 | 4 | 5>('all');
  let liveOnly = $state(false);

  const filtered = $derived(
    catalogue.filter((p) => {
      if (layerFilter !== 'all' && p.layer !== layerFilter) return false;
      if (liveOnly && !p.live) return false;
      if (query) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
      }
      return true;
    }),
  );

  const counts = $derived({
    total: catalogue.length,
    live: catalogue.filter((p) => p.live).length,
  });

  function shortName(name: string): string {
    const parts = name.split('/');
    const last = parts[parts.length - 1] ?? name;
    return last
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join('');
  }
</script>

<svelte:head>
  <title>Components · Kumiki</title>
</svelte:head>

<div class="layout">
  <header class="page-header">
    <div class="page-header-inner">
      <p class="kicker">/ {t.catalogue}</p>
      <h1>{t.title}</h1>
      <p class="lede">{t.lede}</p>
      <p class="counts">{t.countLabel(counts.live, counts.total)}</p>
    </div>
  </header>

  <section class="toolbar">
    <div class="search">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4" fill="none" />
        <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      </svg>
      <input
        type="search"
        placeholder={t.filterPlaceholder}
        bind:value={query}
        aria-label={t.filter}
      />
    </div>

    <div class="seg" role="group" aria-label={t.filter}>
      <button class:on={layerFilter === 'all'} onclick={() => (layerFilter = 'all')}>
        {t.catalogueAll}
      </button>
      <button class:on={layerFilter === 3} onclick={() => (layerFilter = 3)}>{t.layerL3}</button>
      <button class:on={layerFilter === 4} onclick={() => (layerFilter = 4)}>{t.layerL4}</button>
      <button class:on={layerFilter === 5} onclick={() => (layerFilter = 5)}>{t.layerL5}</button>
    </div>

    <label class="toggle">
      <input type="checkbox" bind:checked={liveOnly} />
      <span>{t.filterLive}</span>
    </label>
  </section>

  {#if filtered.length === 0}
    <p class="empty">—</p>
  {:else}
    <ul class="grid">
      {#each filtered as p (p.slug)}
        <li class="card" data-layer={p.layer} data-live={p.live}>
          <a href="/components/{p.slug}">
            <div class="thumb" aria-hidden="true">
              <span class="thumb-mark">{shortName(p.name).slice(0, 2)}</span>
              <span class="thumb-line line-h"></span>
              <span class="thumb-line line-v"></span>
              {#if p.live}
                <span class="thumb-pin" title="Live"></span>
              {/if}
            </div>
            <div class="card-body">
              <header>
                <h3>{shortName(p.name)}</h3>
                <StatusBadge status={p.status} />
              </header>
              <code class="pkg" dir="ltr">{p.name}</code>
              <p>{p.summary}</p>
              <footer>
                <span class="layer-tag">L{p.layer}</span>
                {#if p.live}
                  <span class="live">{t.livePreview} →</span>
                {:else}
                  <span class="dim">—</span>
                {/if}
              </footer>
            </div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .layout {
    max-width: var(--k-content-max);
    margin: 0 auto;
    padding: 0 24px 64px;
  }
  .page-header {
    border-bottom: 1px solid var(--k-line-1);
    margin-bottom: 24px;
  }
  .page-header-inner {
    padding: 64px 0 32px;
    max-width: 80ch;
  }
  .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin-bottom: 16px;
  }
  h1 {
    font-size: clamp(2rem, 3.8vw, 3.2rem);
    line-height: 1.1;
    letter-spacing: -0.035em;
    margin-bottom: 16px;
  }
  .lede {
    font-family: var(--k-font-display);
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--k-ink-2);
    max-width: 60ch;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .counts {
    margin-top: 16px;
    font-family: var(--k-font-mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--k-ink-3);
  }

  .toolbar {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 32px;
    padding-block: 12px;
    border-bottom: 1px dashed var(--k-line-1);
  }
  .search {
    flex: 1 1 240px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    height: 36px;
    background: var(--k-surface-1);
    color: var(--k-ink-3);
  }
  .search:focus-within {
    border-color: var(--k-line-3);
    color: var(--k-ink-2);
  }
  .search input {
    background: transparent;
    border: 0;
    outline: none;
    width: 100%;
    font-size: 13.5px;
  }

  .seg {
    display: inline-flex;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    padding: 2px;
    gap: 2px;
  }
  .seg button {
    background: transparent;
    border: 0;
    color: var(--k-ink-3);
    padding: 5px 10px;
    border-radius: var(--k-radius-xs);
    font-family: var(--k-font-mono);
    font-size: 11px;
    letter-spacing: 0.05em;
    cursor: pointer;
  }
  .seg button.on {
    background: var(--k-ink-1);
    color: var(--k-surface-0);
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
    cursor: pointer;
  }
  .toggle input {
    accent-color: var(--k-shu);
  }

  .grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  .card {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    overflow: hidden;
    transition:
      transform var(--k-dur-fast) var(--k-ease-out),
      box-shadow var(--k-dur-fast),
      border-color var(--k-dur-fast);
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: var(--k-line-3);
    box-shadow: var(--k-shadow-md);
  }
  .card a {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .thumb {
    aspect-ratio: 16 / 9;
    background: var(--k-surface-1);
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--k-line-1);
  }
  .thumb-mark {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);
    font-family: var(--k-font-display);
    font-size: 56px;
    font-weight: 500;
    letter-spacing: -0.03em;
    color: var(--k-ink-1);
    font-variation-settings: 'opsz' 144;
  }
  .thumb-line {
    position: absolute;
    background: var(--k-line-2);
  }
  .thumb-line.line-h {
    inset-inline: 0;
    inset-block-start: 50%;
    height: 1px;
  }
  .thumb-line.line-v {
    inset-block: 0;
    inset-inline-start: 50%;
    width: 1px;
  }
  .thumb-pin {
    position: absolute;
    inset-block-start: 12px;
    inset-inline-end: 12px;
    width: 8px;
    height: 8px;
    background: var(--k-shu);
    border-radius: 999px;
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--k-shu) 25%, transparent);
  }

  .card-body {
    padding: 16px 18px 18px;
  }
  .card-body header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    gap: 8px;
  }
  .card-body h3 {
    font-family: var(--k-font-display);
    font-size: 19px;
    letter-spacing: -0.015em;
    color: var(--k-ink-1);
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  .pkg {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-4);
    background: transparent;
    border: 0;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    display: block;
    margin-bottom: 10px;
  }
  .card-body p {
    color: var(--k-ink-3);
    font-size: 13px;
    line-height: 1.6;
    min-height: 3.5em;
    word-break: keep-all;
    overflow-wrap: anywhere;
    line-break: strict;
  }
  .card-body footer {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-family: var(--k-font-mono);
  }
  .layer-tag {
    color: var(--k-ink-4);
    letter-spacing: 0.06em;
  }
  .live {
    color: var(--k-shu);
  }
  .dim {
    color: var(--k-ink-4);
  }

  .empty {
    padding: 64px 24px;
    text-align: center;
    color: var(--k-ink-3);
  }
</style>
