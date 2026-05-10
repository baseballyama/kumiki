<script lang="ts">
  import { LIVE_PLAYGROUNDS } from '$lib/playgrounds/registry.js';
  import type { Component } from 'svelte';

  let { data } = $props();
  // svelte-ignore state_referenced_locally
  const { entry, snippets, hasDemo, machineSpec, machineSpecJsonUrl, machineSpecVizUrl } = data;

  let DemoComponent: Component | undefined = $state(undefined);
  let demoError = $state<string | undefined>(undefined);

  // Lazy-load the live demo on the client (server cannot tree-shake import.meta.glob results easily).
  $effect(() => {
    if (!hasDemo) return;
    const loader = LIVE_PLAYGROUNDS[entry.slug];
    if (!loader) return;
    loader().then(
      (mod) => {
        DemoComponent = mod.default as Component;
      },
      (err) => {
        demoError = String(err);
      },
    );
  });
</script>

<svelte:head>
  <title>{entry.name} · Playground · Kumiki</title>
</svelte:head>

<nav class="crumb">
  <a href="/play">← All packages</a>
</nav>

<header class="hero">
  <code class="name">{entry.name}</code>
  <span class="status status-{entry.status}">{entry.status}</span>
  <span class="layer">Layer {entry.layer}</span>
  <p>{entry.summary}</p>
  {#if entry.apgUrl}
    <p class="apg">
      <a href={entry.apgUrl} target="_blank" rel="noopener noreferrer"> WAI-ARIA APG pattern ↗ </a>
    </p>
  {/if}
</header>

{#if machineSpec}
  <section class="machine-spec">
    <h2>State machine</h2>
    <p class="machine-blurb">{machineSpec.blurb}</p>
    <dl class="machine-meta">
      <dt>Source</dt>
      <dd><code>{machineSpec.pkg}</code></dd>
      <dt>Initial state</dt>
      <dd><code>{machineSpec.initial}</code></dd>
      <dt>Top-level states</dt>
      <dd>
        {#each machineSpec.states as s, i (s)}<code>{s}</code
          >{#if i < machineSpec.states.length - 1},
          {/if}{/each}
      </dd>
    </dl>
    <p class="machine-links">
      <a href={machineSpecJsonUrl} target="_blank" rel="noopener noreferrer">
        toJSON() snapshot ↗
      </a>
      <span class="sep">·</span>
      <a href={machineSpecVizUrl} target="_blank" rel="noopener noreferrer">
        Open in stately.ai/viz ↗
      </a>
    </p>
    <p class="machine-note">
      Snapshot is regenerated on every <code>pnpm --filter @kumiki/docs build</code> via
      <code>build-machine-specs.mjs</code>.
    </p>
  </section>
{/if}

{#if hasDemo}
  <section class="demo-wrap">
    <h2>Live demo</h2>
    {#if demoError}
      <p class="error">Failed to load demo: <code>{demoError}</code></p>
    {:else if DemoComponent}
      <DemoComponent />
    {:else}
      <p class="loading">Loading…</p>
    {/if}
  </section>
{:else}
  <section class="placeholder">
    <p>
      No live demo yet. {#if entry.status === 'unreleased'}This package is part of a future Phase{:else}This
        Layer is consumed via code, not visually{/if} — see the snippets below.
    </p>
  </section>
{/if}

<section class="snippets">
  <h2>Code samples</h2>
  {#each snippets as s, i (i)}
    <article class="snippet">
      <h3>{s.title}</h3>
      <pre><code class={`lang-${s.lang}`}>{s.code}</code></pre>
    </article>
  {/each}
</section>

<style>
  .crumb {
    margin: 16px 0;
    font-size: 14px;
  }
  .crumb a {
    color: #888;
  }
  .hero {
    padding: 24px 0;
    border-bottom: 1px solid #2a2a4a;
    margin-bottom: 24px;
  }
  .hero .name {
    font-size: 24px;
    color: #4fc08d;
    margin-right: 12px;
  }
  .layer {
    font-size: 12px;
    color: #888;
    margin-left: 8px;
  }
  .hero p {
    margin-top: 12px;
    color: #aaa;
    line-height: 1.5;
    max-width: 70ch;
  }
  .apg a {
    color: #ff3e00;
    font-size: 14px;
  }
  .status {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 600;
    vertical-align: middle;
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

  .machine-spec {
    margin: 24px 0;
    padding: 16px 18px;
    background: #16162a;
    border: 1px solid #2a2a4a;
    border-radius: 10px;
  }
  .machine-spec h2 {
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .machine-blurb {
    color: #ccc;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  .machine-meta {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 4px 12px;
    font-size: 13px;
    margin-bottom: 12px;
  }
  .machine-meta dt {
    color: #888;
  }
  .machine-meta dd {
    color: #ddd;
    margin: 0;
  }
  .machine-meta code {
    background: #0e0e1c;
    color: #4fc08d;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 12px;
  }
  .machine-links {
    font-size: 13px;
  }
  .machine-links a {
    color: #4fc08d;
  }
  .machine-links .sep {
    color: #555;
    margin: 0 6px;
  }
  .machine-note {
    font-size: 12px;
    color: #777;
    margin-top: 8px;
  }
  .machine-note code {
    background: #0e0e1c;
    color: #aaa;
    padding: 1px 5px;
    border-radius: 3px;
  }

  .demo-wrap {
    margin: 32px 0;
  }
  .demo-wrap h2 {
    font-size: 14px;
    color: #888;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .placeholder p {
    color: #888;
    padding: 24px;
    background: #16162a;
    border: 1px dashed #2a2a4a;
    border-radius: 10px;
  }
  .loading,
  .error {
    color: #888;
    padding: 24px;
  }

  .snippets {
    margin-top: 48px;
  }
  .snippets h2 {
    font-size: 14px;
    color: #888;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .snippet {
    margin-bottom: 16px;
  }
  .snippet h3 {
    font-size: 14px;
    color: #ddd;
    margin-bottom: 8px;
  }
  .snippet pre {
    background: #0e0e1c;
    border: 1px solid #2a2a4a;
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.5;
    color: #d0d0d0;
  }
  .snippet code {
    font-family: 'SF Mono', Menlo, Consolas, monospace;
    background: transparent;
  }
</style>
