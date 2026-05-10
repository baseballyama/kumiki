<!--
  /api index — three-column "kumiki joinery" cover. Each column is one
  package, with a header and a list of modules.
-->
<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>API reference · Kumiki</title>
  <meta
    name="description"
    content="Auto-generated API reference for every public module in Kumiki — runtime, primitives, locale, types, machines, headless."
  />
</svelte:head>

<header class="cover">
  <p class="kicker">Reference</p>
  <h1 class="title">
    <span class="word">API</span>
  </h1>
  <p class="lede">
    Every public type, function, and namespace in <code>@kumiki/*</code>. Auto-generated from
    TypeScript and JSDoc. The source of truth is the published <code>.d.ts</code> — refresh with
    <code>pnpm typedoc</code>.
  </p>

  <div class="rule" aria-hidden="true">
    <span class="notch"></span>
    <span class="line"></span>
    <span class="notch"></span>
  </div>
</header>

<section class="grid">
  {#each data.packages as pkg, idx (pkg.id)}
    <article class="col" style="--col-stagger: {idx * 60}ms">
      <header class="col-head">
        <div class="col-title">
          <span class="col-mark" aria-hidden="true">⟢</span>
          <h2>{pkg.name}</h2>
        </div>
        <p class="col-tag">{pkg.tagline}</p>
        <p class="col-stat">
          <span class="stat-num">{pkg.modules.length}</span>
          <span class="stat-unit">module{pkg.modules.length === 1 ? '' : 's'}</span>
        </p>
      </header>

      <ul class="modules">
        {#each pkg.modules as m, mIdx (m.slug)}
          <li style="animation-delay: calc(var(--col-stagger) + {mIdx * 28}ms)">
            <a href={`/api/${m.slug}`}>
              <span class="m-name">{m.name}</span>
              <span class="m-rule" aria-hidden="true"></span>
              <span class="m-count">{m.memberCount}</span>
              <svg class="m-arrow" width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
                <path d="M2 7L7 2M3 2h4v4" stroke="currentColor" stroke-width="1.2" fill="none" />
              </svg>
            </a>
          </li>
        {/each}
      </ul>
    </article>
  {/each}
</section>

<footer class="foot">
  <p>
    No-drift guarantee. CI runs <code>pnpm check:api-docs</code> on every PR — TypeDoc re-emits
    every page and the build fails if any JSDoc is broken or any type drifts. Locally,
    <code>pnpm dev</code> regenerates whenever <code>packages/</code> sources are newer than
    <code>docs/api/</code>.
  </p>
</footer>

<style>
  .cover {
    padding: 8px 0 32px;
    margin-bottom: 32px;
    position: relative;
  }
  .kicker {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--k-shu-ink);
    margin: 0 0 14px;
  }
  :global([data-theme='dark']) .kicker {
    color: var(--k-shu);
  }
  .title {
    font-family: var(--k-font-display);
    font-size: clamp(4rem, 12vw, 7.5rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
    margin: 0 0 24px;
    color: var(--k-ink-1);
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }
  .word {
    display: inline-block;
    background-image: linear-gradient(
      180deg,
      var(--k-ink-1) 0%,
      var(--k-ink-1) 78%,
      var(--k-shu-ink) 78%,
      var(--k-shu-ink) 100%
    );
    background-size: 100% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  :global([data-theme='dark']) .word {
    background-image: linear-gradient(
      180deg,
      var(--k-ink-1) 0%,
      var(--k-ink-1) 78%,
      var(--k-shu) 78%,
      var(--k-shu) 100%
    );
  }
  .lede {
    font-family: var(--k-font-display);
    font-size: 1.1rem;
    line-height: 1.65;
    color: var(--k-ink-2);
    max-width: 60ch;
    margin: 0;
    font-variation-settings:
      'opsz' 36,
      'SOFT' 30;
  }
  .lede code {
    font-family: var(--k-font-mono);
    font-size: 0.9em;
    color: var(--k-ink-1);
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: 3px;
    padding: 0 0.35em;
  }

  /* Kumiki notch — the visual signature: two short blocks bracketing a
     hairline rule. Suggests a wood joint without being literal. */
  .rule {
    display: flex;
    align-items: center;
    gap: 0;
    margin: 32px 0 0;
  }
  .notch {
    width: 14px;
    height: 6px;
    background: var(--k-shu);
  }
  .line {
    flex: 1;
    height: 1px;
    background: var(--k-line-2);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    margin-bottom: 64px;
  }
  .col {
    padding: 32px 24px 24px 0;
    border-inline-end: 1px solid var(--k-line-1);
    position: relative;
  }
  .col:last-child {
    border-inline-end: 0;
  }
  .col + .col {
    padding-inline-start: 24px;
  }
  /* Notch dots at the joins — only between columns. */
  .col + .col::before {
    content: '';
    position: absolute;
    inset-inline-start: -3px;
    inset-block-start: 32px;
    width: 6px;
    height: 6px;
    background: var(--k-shu);
    border-radius: 50%;
  }
  .col-head {
    margin-bottom: 18px;
  }
  .col-title {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
  }
  .col-mark {
    color: var(--k-shu);
    font-size: 18px;
    line-height: 1;
  }
  .col h2 {
    font-family: var(--k-font-display);
    font-size: 1.75rem;
    line-height: 1;
    letter-spacing: -0.025em;
    color: var(--k-ink-1);
    margin: 0;
    font-variation-settings:
      'opsz' 72,
      'SOFT' 30;
  }
  .col-tag {
    font-size: 13.5px;
    color: var(--k-ink-3);
    line-height: 1.5;
    margin: 0 0 8px;
  }
  .col-stat {
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-4);
    margin: 0;
    display: flex;
    align-items: baseline;
    gap: 5px;
  }
  .stat-num {
    font-size: 14px;
    color: var(--k-ink-1);
    font-variant-numeric: tabular-nums;
  }

  .modules {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .modules li {
    opacity: 0;
    animation: fade-up var(--k-dur-mid) var(--k-ease-out) forwards;
  }
  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .modules a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    color: var(--k-ink-2);
    text-decoration: none;
    border-bottom: 1px solid var(--k-line-1);
    transition: color var(--k-dur-fast);
  }
  .modules a:hover {
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .modules a:hover {
    color: var(--k-shu);
  }
  .m-name {
    font-family: var(--k-font-mono);
    font-size: 13.5px;
    color: var(--k-ink-1);
    transition: color var(--k-dur-fast);
  }
  .modules a:hover .m-name {
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .modules a:hover .m-name {
    color: var(--k-shu);
  }
  .m-rule {
    flex: 1;
    height: 1px;
    background: transparent;
  }
  .m-count {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-4);
    font-variant-numeric: tabular-nums;
  }
  .m-arrow {
    color: var(--k-ink-5);
    transition:
      transform var(--k-dur-fast),
      color var(--k-dur-fast);
  }
  .modules a:hover .m-arrow {
    color: var(--k-shu);
    transform: translate(2px, -2px);
  }
  :global([dir='rtl']) .modules a:hover .m-arrow {
    transform: translate(-2px, -2px) scaleX(-1);
  }

  .foot {
    border-top: 1px solid var(--k-line-1);
    padding-top: 24px;
    color: var(--k-ink-4);
    font-size: 13px;
    line-height: 1.6;
  }
  .foot code {
    font-family: var(--k-font-mono);
    font-size: 0.92em;
    color: var(--k-ink-2);
    background: var(--k-code-bg);
    border: 1px solid var(--k-code-line);
    border-radius: 3px;
    padding: 0 0.35em;
  }

  @media (max-width: 920px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .col {
      padding: 24px 0;
      border-inline-end: 0;
      border-bottom: 1px solid var(--k-line-1);
    }
    .col:last-child {
      border-bottom: 0;
    }
    .col + .col {
      padding-inline-start: 0;
    }
    .col + .col::before {
      inset-block-start: -3px;
      inset-inline-start: 0;
    }
  }
</style>
