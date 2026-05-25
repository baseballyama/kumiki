<script lang="ts">
  import { resolve } from '$app/paths';
  import { PLAYGROUNDS } from '$lib/playgrounds/registry.js';

  const groups = $derived.by(() => {
    const out: Record<number, typeof PLAYGROUNDS> = {};
    for (const p of PLAYGROUNDS) {
      out[p.layer] ??= [];
      (out[p.layer] as unknown as (typeof PLAYGROUNDS)[number][]).push(p);
    }
    return out;
  });

  const layerLabels: Record<number, string> = {
    0: 'Layer 0 — Shared types',
    1: 'Layer 1 — Primitives',
    2: 'Layer 2 — State machines',
    3: 'Layer 3 — Attachments',
    4: 'Layer 4 — Compound components',
    5: 'Layer 5 — Recipes (preview)',
  };
</script>

<svelte:head>
  <title>Playground · Kumiki</title>
</svelte:head>

<section class="hero">
  <h1>Playground</h1>
  <p>
    Every Kumiki package has a page here. Layer 4 / Layer 5 packages render live and let you try
    every prop interactively. Lower layers list code samples and the public API surface.
  </p>
  <p class="meta">
    {PLAYGROUNDS.length} packages · {PLAYGROUNDS.filter((p) => p.live).length} with live demos
  </p>
</section>

{#each [0, 1, 2, 3, 4, 5] as layer (layer)}
  {#if groups[layer]?.length}
    <section class="layer">
      <h2>{layerLabels[layer]}</h2>
      <ul class="cards">
        {#each groups[layer] ?? [] as p (p.slug)}
          <li class="card" class:has-demo={p.live}>
            <a href={resolve(`/play/${p.slug}`)}>
              <header>
                <code>{p.name}</code>
                <span class="status status-{p.status}">{p.status}</span>
              </header>
              <p>{p.summary}</p>
              {#if p.live}
                <span class="badge">Live demo</span>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
{/each}

<style>
  .hero {
    padding: 32px 0 24px;
  }
  .hero h1 {
    font-size: 32px;
    margin-bottom: 12px;
  }
  .hero p {
    color: #aaa;
    max-width: 60ch;
    line-height: 1.5;
  }
  .meta {
    margin-top: 8px;
    font-size: 14px;
    color: #777;
  }

  .layer {
    margin-bottom: 32px;
  }
  .layer h2 {
    font-size: 16px;
    color: #888;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .cards {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;
  }
  .card {
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 10px;
    transition: border-color 120ms;
  }
  .card.has-demo {
    border-color: #ff3e0040;
  }
  .card:hover {
    border-color: #ff3e00;
  }
  .card a {
    display: block;
    padding: 16px;
    color: inherit;
  }
  .card a:hover {
    text-decoration: none;
  }
  .card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .card code {
    font-size: 13px;
    color: #4fc08d;
    background: transparent;
  }
  .card p {
    color: #aaa;
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 8px;
  }
  .badge {
    display: inline-block;
    background: #ff3e00;
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
  }
  .status {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 500;
  }
  .status-stable {
    background: #4fc08d;
    color: #0a0a18;
  }
  .status-preview {
    background: #ffa940;
    color: #0a0a18;
  }
  .status-unreleased {
    background: #444;
    color: #999;
  }
</style>
