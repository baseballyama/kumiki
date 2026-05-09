<!--
  Generic prose container — wraps a doc page so the typography rules from
  global.css's `.prose` class apply consistently.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    children,
    kicker,
    title,
    lede,
  }: { children: Snippet; kicker?: string; title: string; lede?: string } = $props();
</script>

<header class="head">
  {#if kicker}
    <p class="kicker">{kicker}</p>
  {/if}
  <h1>{title}</h1>
  {#if lede}
    <p class="lede">{lede}</p>
  {/if}
</header>

<div class="prose">
  {@render children()}
</div>

<style>
  .head {
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--k-line-1);
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
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }
  .lede {
    font-family: var(--k-font-display);
    font-size: 1.15rem;
    line-height: 1.65;
    color: var(--k-ink-2);
    max-width: 60ch;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
</style>
