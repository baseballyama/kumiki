<!--
  Components catalog. One tile per base component name (Alert, Avatar …),
  sorted alphabetically. Each tile shows a live thumbnail of the real
  component and chips for the Layers (L3 / L4 / L5) it's available in.
-->
<script lang="ts">
  import { PLAYGROUNDS, LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
  import type { PlaygroundEntry } from '$lib/playgrounds/registry.js';
  import { ui } from '$lib/i18n/store.svelte.js';
  import { dict } from '$lib/i18n/dict.js';
  import LiveThumb from '$lib/components/LiveThumb.svelte';

  const t = $derived(dict(ui.locale).components);

  /** `component-radio-group` → `radio-group`; same for atelier/attachment/machine. */
  function baseName(slug: string): string {
    return slug.replace(/^(component|atelier|attachment|machine)-/, '');
  }

  function prettyFromBase(base: string): string {
    return base
      .split('-')
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join('');
  }

  type LayerInfo = { layer: 3 | 4 | 5; entry: PlaygroundEntry };
  type Group = {
    base: string;
    display: string;
    layers: LayerInfo[];
    /** Slug whose live demo we mount as the tile thumbnail (best-available). */
    thumbSlug: string | null;
    /** Slug the tile links to when clicked. */
    primarySlug: string;
  };

  const groups = $derived.by<Group[]>(() => {
    const map = new Map<string, Group>();
    for (const p of PLAYGROUNDS) {
      if (p.layer < 3 || p.layer > 5) continue;
      const base = baseName(p.slug);
      let g = map.get(base);
      if (!g) {
        g = {
          base,
          display: prettyFromBase(base),
          layers: [],
          thumbSlug: null,
          primarySlug: p.slug,
        };
        map.set(base, g);
      }
      g.layers.push({ layer: p.layer as 3 | 4 | 5, entry: p });
    }

    // Pick the best demo + canonical link for each group.
    // Preference: atelier (L5) > component (L4) > attachment (L3),
    // limited to ones that have a live demo.
    for (const g of map.values()) {
      g.layers.sort((a, b) => a.layer - b.layer);
      const byLayer = new Map(g.layers.map((l) => [l.layer, l.entry]));
      const pick =
        (byLayer.get(5) && LIVE_PLAYGROUNDS[byLayer.get(5)!.slug] && byLayer.get(5)) ||
        (byLayer.get(4) && LIVE_PLAYGROUNDS[byLayer.get(4)!.slug] && byLayer.get(4)) ||
        (byLayer.get(3) && LIVE_PLAYGROUNDS[byLayer.get(3)!.slug] && byLayer.get(3)) ||
        null;
      g.thumbSlug = pick?.slug ?? null;
      // Click target: prefer L4 (Compound component), then L5, then L3.
      const primary = byLayer.get(4) ?? byLayer.get(5) ?? byLayer.get(3) ?? g.layers[0]?.entry;
      g.primarySlug = primary?.slug ?? g.primarySlug;
    }

    return [...map.values()].sort((a, b) => a.display.localeCompare(b.display));
  });

  let query = $state('');
  let layerFilter = $state<'all' | 3 | 4 | 5>('all');

  const filtered = $derived(
    groups.filter((g) => {
      if (layerFilter !== 'all' && !g.layers.some((l) => l.layer === layerFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!g.display.toLowerCase().includes(q) && !g.base.includes(q)) return false;
      }
      return true;
    }),
  );

  const counts = $derived({
    components: groups.length,
    live: groups.filter((g) => g.thumbSlug !== null).length,
  });
</script>

<svelte:head>
  <title>Components · Kumiki</title>
</svelte:head>

<div class="layout">
  <header class="page-header">
    <div class="page-header-inner">
      <p class="kicker">/ {t.catalogue}</p>
      <h1>{t.title}</h1>
      <p class="counts" dir="ltr">
        {counts.components} components · {counts.live} live
      </p>
    </div>
  </header>

  <section class="toolbar" aria-label={t.filter}>
    <div class="search">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
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
      <button class:on={layerFilter === 3} onclick={() => (layerFilter = 3)}>L3</button>
      <button class:on={layerFilter === 4} onclick={() => (layerFilter = 4)}>L4</button>
      <button class:on={layerFilter === 5} onclick={() => (layerFilter = 5)}>L5</button>
    </div>
  </section>

  {#if filtered.length === 0}
    <p class="empty">—</p>
  {:else}
    <ul class="grid">
      {#each filtered as g (g.base)}
        <li class="tile">
          <a class="cover" href="/components/{g.primarySlug}" aria-label={g.display}>
            <div class="thumb-wrap">
              {#if g.thumbSlug}
                <LiveThumb slug={g.thumbSlug} />
              {:else}
                <div class="placeholder" aria-hidden="true">{g.display.slice(0, 2)}</div>
              {/if}
            </div>
          </a>
          <div class="meta">
            <h3>
              <a href="/components/{g.primarySlug}">{g.display}</a>
            </h3>
            <div class="layers" aria-label="Available layers">
              {#each g.layers as l (l.layer)}
                <a
                  class="chip"
                  data-layer={l.layer}
                  href="/components/{l.entry.slug}"
                  title={`L${l.layer} — ${t.layerLabel(l.layer)}`}
                >
                  L{l.layer}
                </a>
              {/each}
            </div>
          </div>
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
    margin-bottom: 20px;
  }
  .page-header-inner {
    padding: 56px 0 24px;
    max-width: 80ch;
  }
  .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin-bottom: 12px;
  }
  h1 {
    font-size: clamp(1.8rem, 3.2vw, 2.6rem);
    line-height: 1.05;
    letter-spacing: -0.035em;
    margin-bottom: 12px;
  }
  .counts {
    font-family: var(--k-font-mono);
    font-size: 12px;
    letter-spacing: 0.04em;
    color: var(--k-ink-3);
  }

  /* Toolbar */
  .toolbar {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
    padding-block: 10px;
    border-bottom: 1px dashed var(--k-line-1);
  }
  .search {
    flex: 1 1 200px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 10px;
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    height: 32px;
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
    font-size: 13px;
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
    padding: 4px 10px;
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

  /* Dense grid */
  .grid {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 10px;
  }

  .tile {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    transition:
      border-color var(--k-dur-fast) var(--k-ease-out),
      transform var(--k-dur-fast) var(--k-ease-out),
      box-shadow var(--k-dur-fast) var(--k-ease-out);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .tile::before {
    content: '';
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 2px;
    background: var(--k-shu);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--k-dur-fast) var(--k-ease-out);
    z-index: 1;
  }
  .tile:hover,
  .tile:focus-within {
    border-color: var(--k-line-3);
    transform: translateY(-1px);
    box-shadow: var(--k-shadow-sm);
  }
  .tile:hover::before,
  .tile:focus-within::before {
    transform: scaleX(1);
  }

  .cover {
    display: block;
    color: inherit;
    text-decoration: none;
    padding: 10px 10px 0;
  }
  .cover:focus-visible {
    outline: 0;
  }
  .cover:focus-visible .thumb-wrap {
    box-shadow: 0 0 0 2px var(--k-shu);
  }
  .thumb-wrap {
    border-radius: var(--k-radius-xs);
    overflow: hidden;
    background: var(--k-surface-1);
    transition: box-shadow var(--k-dur-fast);
  }
  .placeholder {
    aspect-ratio: 7 / 5;
    display: grid;
    place-items: center;
    font-family: var(--k-font-display);
    font-size: 26px;
    color: var(--k-ink-3);
    background: var(--k-surface-1);
  }

  .meta {
    padding: 8px 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .meta h3 {
    font-family: var(--k-font-display);
    font-size: 14.5px;
    line-height: 1.2;
    letter-spacing: -0.012em;
    color: var(--k-ink-1);
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta h3 a {
    color: inherit;
    text-decoration: none;
  }
  .meta h3 a:hover {
    color: var(--k-shu-ink);
  }

  .layers {
    display: inline-flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .chip {
    font-family: var(--k-font-mono);
    font-size: 10px;
    letter-spacing: 0.05em;
    line-height: 1;
    padding: 3px 6px;
    border-radius: 3px;
    border: 1px solid var(--k-line-1);
    background: var(--k-surface-1);
    color: var(--k-ink-3);
    text-decoration: none;
    transition:
      border-color 120ms,
      color 120ms,
      background 120ms;
  }
  .chip:hover {
    border-color: var(--k-line-3);
    color: var(--k-ink-1);
    background: var(--k-surface-2);
  }
  .chip[data-layer='3'] {
    color: var(--k-ink-3);
  }
  .chip[data-layer='5'] {
    color: var(--k-shu);
    border-color: color-mix(in oklab, var(--k-shu) 30%, var(--k-line-1));
    background: color-mix(in oklab, var(--k-shu) 4%, var(--k-surface-1));
  }
  .chip[data-layer='5']:hover {
    background: color-mix(in oklab, var(--k-shu) 10%, var(--k-surface-1));
  }

  .empty {
    padding: 64px 24px;
    text-align: center;
    color: var(--k-ink-3);
  }
</style>
