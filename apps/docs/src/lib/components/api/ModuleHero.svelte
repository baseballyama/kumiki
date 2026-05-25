<!--
  Module page hero. Asymmetric: package crumb + import path on the left,
  member-kind tally chips on the right.
-->
<script lang="ts">
  import { resolve } from '$app/paths';
  import type { ApiModule, MemberKind } from '$lib/api/types.js';
  import MemberKindLabel from './MemberKindLabel.svelte';

  let { module }: { module: ApiModule } = $props();

  const KIND_ORDER: readonly MemberKind[] = [
    'interface',
    'class',
    'type-alias',
    'enum',
    'function',
    'variable',
    'namespace',
  ];

  const tally = $derived(
    KIND_ORDER.map((kind) => ({
      kind,
      count: module.members.filter((m) => m.kind === kind).length,
    })).filter((t) => t.count > 0),
  );
</script>

<header class="hero">
  <p class="crumb">
    <a href={resolve('/api')}>Reference</a>
    <span class="sep" aria-hidden="true">／</span>
    <span class="package">{module.packageId}</span>
  </p>

  <h1 class="title">{module.name}</h1>

  <div class="grain" aria-hidden="true">
    <div class="bracket bracket--start"></div>
    <code class="import"
      >import &lbrace; … &rbrace; from '<span class="hl">{module.fullName}</span>'</code
    >
    <div class="bracket bracket--end"></div>
  </div>

  {#if tally.length > 0}
    <div class="tally">
      {#each tally as t (t.kind)}
        <span class="chip">
          <MemberKindLabel kind={t.kind} size="sm" />
          <span class="chip-count">{t.count}</span>
        </span>
      {/each}
    </div>
  {/if}
</header>

<style>
  .hero {
    padding: 8px 0 32px;
    border-bottom: 1px solid var(--k-line-1);
    margin-bottom: 36px;
  }
  .crumb {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin: 0 0 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .crumb a {
    color: inherit;
    text-decoration: none;
  }
  .crumb a:hover {
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .crumb a:hover {
    color: var(--k-shu);
  }
  .crumb .sep {
    color: var(--k-ink-5);
  }
  .package {
    color: var(--k-ink-3);
  }

  .title {
    font-family: var(--k-font-display);
    font-size: clamp(2.4rem, 4vw + 1rem, 4rem);
    line-height: 1;
    letter-spacing: -0.04em;
    color: var(--k-ink-1);
    margin: 0 0 20px;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }

  /* "import" line — the kumiki notch. Two short brackets and a mono path. */
  .grain {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-sm);
    margin-bottom: 24px;
    max-width: 100%;
    overflow-x: auto;
  }
  .bracket {
    width: 8px;
    height: 1px;
    background: var(--k-shu);
    flex-shrink: 0;
  }
  .bracket--start {
    box-shadow: 0 -4px 0 var(--k-shu);
  }
  .bracket--end {
    box-shadow: 0 4px 0 var(--k-shu);
  }
  .import {
    font-family: var(--k-font-mono);
    font-size: 12.5px;
    color: var(--k-ink-3);
    background: transparent;
    border: 0;
    padding: 0;
    white-space: nowrap;
  }
  .import .hl {
    color: var(--k-ink-1);
    font-weight: 600;
  }

  .tally {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 10px;
    border: 1px solid var(--k-line-1);
    border-radius: 999px;
    background: var(--k-surface-1);
  }
  .chip-count {
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
    color: var(--k-ink-3);
  }
</style>
