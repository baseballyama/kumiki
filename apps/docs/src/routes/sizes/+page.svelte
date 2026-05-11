<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const sizes = $derived(data.sizes);

  type Band = 'safe' | 'tight' | 'fail';

  function formatBytes(n: number): string {
    if (n < 1024) return `${n} B`;
    return `${(n / 1024).toFixed(2)} kB`;
  }

  function pct(size: number, limit: number): number {
    return Math.round((size / limit) * 100);
  }

  function band(p: number): Band {
    if (p >= 100) return 'fail';
    if (p >= 90) return 'tight';
    return 'safe';
  }

  const generatedLabel = $derived(
    sizes ? new Date(sizes.generatedAt).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : '',
  );

  type FlatEntry = {
    name: string;
    size: number;
    sizeLimit: number;
    p: number;
    b: Band;
  };

  const flat = $derived<FlatEntry[]>(
    sizes
      ? sizes.packages.flatMap((pkg) =>
          pkg.entries.map((e) => {
            const p = pct(e.size, e.sizeLimit);
            return { name: e.name, size: e.size, sizeLimit: e.sizeLimit, p, b: band(p) };
          }),
        )
      : [],
  );

  type Filter = 'all' | Band;
  let filter = $state<Filter>('all');

  const counts = $derived({
    all: flat.length,
    safe: flat.filter((e) => e.b === 'safe').length,
    tight: flat.filter((e) => e.b === 'tight').length,
    fail: flat.filter((e) => e.b === 'fail').length,
  });

  const summary = $derived(() => {
    if (flat.length === 0) {
      return { totalSize: 0, totalLimit: 0, tightest: null as FlatEntry | null, avgHeadroom: 0 };
    }
    const totalSize = flat.reduce((s, e) => s + e.size, 0);
    const totalLimit = flat.reduce((s, e) => s + e.sizeLimit, 0);
    const tightest = [...flat].sort((a, b) => b.p - a.p)[0] ?? null;
    const avgHeadroom = Math.round(flat.reduce((s, e) => s + (100 - e.p), 0) / flat.length);
    return { totalSize, totalLimit, tightest, avgHeadroom };
  });

  function shouldShow(b: Band): boolean {
    return filter === 'all' || filter === b;
  }

  function pkgBandSummary(entries: ReadonlyArray<{ size: number; sizeLimit: number }>) {
    let safe = 0;
    let tight = 0;
    let fail = 0;
    for (const e of entries) {
      const b = band(pct(e.size, e.sizeLimit));
      if (b === 'safe') safe++;
      else if (b === 'tight') tight++;
      else fail++;
    }
    return { safe, tight, fail };
  }

  const ticks = [0, 25, 50, 75, 90, 100];
</script>

<svelte:head>
  <title>Bundle sizes · Kumiki</title>
</svelte:head>

<article class="ledger">
  <header class="masthead">
    <div class="mast-left">
      <p class="eyebrow">
        <span class="eb-rule" aria-hidden="true"></span>
        <span>Ledger / 寸法</span>
        <span class="eb-vol">Vol. 01</span>
      </p>
      <h1>
        <span class="line-a">Bundle</span>
        <span class="line-b">sizes</span>
      </h1>
      <p class="subhead">
        Per-subpath measurements, brotli-compressed. Authoritative limits are enforced in CI via
        <a href="https://github.com/ai/size-limit">size-limit</a>.
      </p>
    </div>

    <aside class="mast-right" aria-hidden="true">
      <div class="seal">
        <span class="seal-ji">量</span>
        <span class="seal-mark"></span>
      </div>
      {#if sizes}
        <dl class="stamp">
          <dt>Issued</dt>
          <dd>{generatedLabel}</dd>
          <dt>Source</dt>
          <dd><a href="/sizes.json">/sizes.json</a></dd>
        </dl>
      {/if}
    </aside>
  </header>

  {#if !sizes}
    <section class="empty">
      <p class="empty-ji" aria-hidden="true">空</p>
      <h2>No measurements yet</h2>
      <p>
        Run <code>pnpm build:sizes</code> at the repo root to populate
        <code>/sizes.json</code>.
      </p>
    </section>
  {:else}
    <section class="stats" aria-label="Aggregate measurements">
      <div class="stat">
        <p class="stat-label">Subpaths measured</p>
        <p class="stat-figure">{flat.length}</p>
        <p class="stat-foot">
          across <span>{sizes.packages.length}</span> packages
        </p>
      </div>
      <div class="stat">
        <p class="stat-label">Total gzip footprint</p>
        <p class="stat-figure">
          {formatBytes(summary().totalSize)}
        </p>
        <p class="stat-foot">
          of <span>{formatBytes(summary().totalLimit)}</span> budgeted
        </p>
      </div>
      <div class="stat">
        <p class="stat-label">Tightest fit</p>
        <p class="stat-figure tight-fig">
          {summary().tightest ? `${summary().tightest!.p}%` : '—'}
        </p>
        <p class="stat-foot">
          {#if summary().tightest}
            <code>{summary().tightest!.name}</code>
          {:else}—{/if}
        </p>
      </div>
      <div class="stat">
        <p class="stat-label">Avg headroom</p>
        <p class="stat-figure">{summary().avgHeadroom}%</p>
        <p class="stat-foot">below the budget line</p>
      </div>
    </section>

    <nav class="filterbar" aria-label="Filter entries by band">
      <div class="filter-group" role="tablist">
        {#each [{ k: 'all', label: 'All' }, { k: 'safe', label: 'Safe' }, { k: 'tight', label: 'Tight' }, { k: 'fail', label: 'Over' }] as f, i (f.k)}
          <button
            type="button"
            role="tab"
            aria-selected={filter === f.k}
            class="filter-btn"
            class:active={filter === f.k}
            class:b-safe={f.k === 'safe'}
            class:b-tight={f.k === 'tight'}
            class:b-fail={f.k === 'fail'}
            onclick={() => (filter = f.k as Filter)}
          >
            <span class="f-dot" aria-hidden="true"></span>
            <span class="f-label">{f.label}</span>
            <span class="f-count">{counts[f.k as keyof typeof counts]}</span>
          </button>
        {/each}
      </div>
      <p class="filter-hint" aria-hidden="true">✓ ≤89% · ! 90–99% · ✘ ≥100%</p>
    </nav>

    <section class="packages">
      {#each sizes.packages as pkg, idx (pkg.package)}
        {@const bs = pkgBandSummary(pkg.entries)}
        {@const visibleEntries = pkg.entries.filter((e) =>
          shouldShow(band(pct(e.size, e.sizeLimit))),
        )}
        {#if visibleEntries.length > 0}
          <article class="pkg" style:--row-i={idx}>
            <header class="pkg-head">
              <div class="pkg-tab" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</div>
              <div class="pkg-id">
                <h2 class="pkg-name">{pkg.package}</h2>
                <p class="pkg-dir">
                  <span class="lbl">dir</span>
                  <code>{pkg.directory}</code>
                </p>
              </div>
              <div class="pkg-pills">
                {#if bs.safe > 0}
                  <span class="pill p-safe" title="Within budget"
                    ><span class="p-dot" aria-hidden="true"></span>{bs.safe} safe</span
                  >
                {/if}
                {#if bs.tight > 0}
                  <span class="pill p-tight" title="≥ 90% of limit"
                    ><span class="p-dot" aria-hidden="true"></span>{bs.tight} tight</span
                  >
                {/if}
                {#if bs.fail > 0}
                  <span class="pill p-fail" title="At or over limit"
                    ><span class="p-dot" aria-hidden="true"></span>{bs.fail} over</span
                  >
                {/if}
              </div>
            </header>

            <ul class="entries" role="list">
              {#each visibleEntries as entry (entry.name)}
                {@const p = pct(entry.size, entry.sizeLimit)}
                {@const b = band(p)}
                <li
                  class="entry"
                  class:safe={b === 'safe'}
                  class:tight={b === 'tight'}
                  class:fail={b === 'fail'}
                >
                  <div class="entry-meta">
                    <span class="status" aria-hidden="true">
                      {#if b === 'safe'}✓{:else if b === 'tight'}!{:else}✘{/if}
                    </span>
                    <span class="entry-name">{entry.name}</span>
                  </div>
                  <div class="entry-nums">
                    <span class="num size">{formatBytes(entry.size)}</span>
                    <span class="num-sep" aria-hidden="true">/</span>
                    <span class="num limit">{formatBytes(entry.sizeLimit)}</span>
                  </div>
                  <div class="entry-gauge">
                    <div
                      class="ruler"
                      role="progressbar"
                      aria-valuemin="0"
                      aria-valuemax={entry.sizeLimit}
                      aria-valuenow={entry.size}
                      aria-label="{entry.name}: {formatBytes(entry.size)} of {formatBytes(
                        entry.sizeLimit,
                      )}"
                      style:--pct="{Math.min(p, 100)}%"
                    >
                      <span class="ruler-fill" aria-hidden="true"></span>
                      <span class="ruler-marks" aria-hidden="true">
                        {#each ticks as t (t)}
                          <span
                            class="tick"
                            class:tick-major={t === 0 || t === 100}
                            class:tick-threshold={t === 90}
                            style:left="{t}%"
                          ></span>
                        {/each}
                      </span>
                      <span class="ruler-pct" aria-hidden="true">{p}<i>%</i></span>
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          </article>
        {/if}
      {/each}
    </section>
  {/if}

  <footer class="colophon" aria-hidden="true">
    <span class="colophon-rule"></span>
    <span class="colophon-text">
      Measured with <code>size-limit</code> · brotli · gzip equivalent ·
      <a href="/sizes/compare">vs. peer libraries →</a>
    </span>
  </footer>
</article>

<style>
  .ledger {
    --measure-grid: oklch(var(--measure-grid-l, 0.96) 0.005 80);
    max-width: 1080px;
    margin: 0 auto;
    padding: 64px 24px 96px;
    font-family: var(--k-font-sans);
    color: var(--k-ink-1);
  }
  :global([data-theme='dark']) .ledger {
    --measure-grid-l: 0.22;
  }

  /* ── Masthead ────────────────────────────────────────────────────────── */
  .masthead {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 240px;
    gap: 48px;
    align-items: end;
    padding-bottom: 48px;
    border-bottom: 1px solid var(--k-line-2);
    position: relative;
  }
  .masthead::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: var(--k-line-2);
    transform: translateY(3px);
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: var(--k-ink-3);
    margin: 0 0 28px;
  }
  .eb-rule {
    display: inline-block;
    width: 36px;
    height: 1px;
    background: var(--k-shu);
  }
  .eb-vol {
    color: var(--k-shu-ink);
    font-weight: 500;
  }
  :global([data-theme='dark']) .eb-vol {
    color: var(--k-shu);
  }
  h1 {
    font-family: var(--k-font-display);
    font-size: clamp(2.4rem, 7vw, 5.5rem);
    line-height: 0.96;
    font-weight: 400;
    letter-spacing: -0.035em;
    margin: 0;
    font-variation-settings:
      'opsz' 144,
      'SOFT' 30;
  }
  h1 .line-a {
    display: block;
    color: var(--k-ink-1);
  }
  h1 .line-b {
    display: block;
    font-style: italic;
    color: var(--k-shu-ink);
    font-variation-settings:
      'opsz' 144,
      'SOFT' 100;
    margin-left: 0.18em;
  }
  :global([data-theme='dark']) h1 .line-b {
    color: var(--k-shu);
  }
  .subhead {
    font-family: var(--k-font-display);
    font-variation-settings: 'opsz' 36;
    font-size: clamp(0.98rem, 1.1vw, 1.08rem);
    line-height: 1.55;
    color: var(--k-ink-2);
    max-width: 56ch;
    margin: 24px 0 0;
  }
  .subhead a {
    color: var(--k-ink-1);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: var(--k-shu);
    text-decoration-thickness: 1.5px;
  }

  .mast-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
  }
  .seal {
    position: relative;
    width: 86px;
    height: 86px;
    display: grid;
    place-items: center;
    border: 1.5px solid var(--k-shu);
    border-radius: var(--k-radius-sm);
    background: var(--k-shu-soft);
    transform: rotate(-3deg);
  }
  .seal-ji {
    font-family: var(--k-font-display);
    font-size: 50px;
    color: var(--k-shu-ink);
    font-weight: 600;
    line-height: 1;
    font-variation-settings: 'opsz' 144;
  }
  :global([data-theme='dark']) .seal-ji {
    color: var(--k-shu);
  }
  .seal-mark {
    position: absolute;
    bottom: -8px;
    right: -8px;
    width: 18px;
    height: 18px;
    background: var(--k-shu);
    border-radius: 50%;
    box-shadow: 0 0 0 3px var(--k-surface-0);
  }
  .stamp {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4px 14px;
    font-family: var(--k-font-mono);
    font-size: 11px;
    text-align: right;
  }
  .stamp dt {
    color: var(--k-ink-4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    grid-column: 1;
  }
  .stamp dd {
    margin: 0;
    color: var(--k-ink-2);
    grid-column: 2;
    text-align: left;
  }
  .stamp dd a {
    color: var(--k-ink-1);
  }

  /* ── Empty state ─────────────────────────────────────────────────────── */
  .empty {
    margin-top: 64px;
    padding: 48px;
    border: 1px dashed var(--k-line-2);
    border-radius: var(--k-radius-md);
    text-align: center;
    background: var(--k-surface-1);
  }
  .empty-ji {
    font-family: var(--k-font-display);
    font-size: 80px;
    color: var(--k-ink-4);
    margin: 0 0 12px;
    line-height: 1;
  }
  .empty h2 {
    font-family: var(--k-font-display);
    font-size: 1.5rem;
    font-weight: 400;
    margin: 0 0 8px;
  }
  .empty p {
    color: var(--k-ink-3);
    margin: 0;
  }

  /* ── Aggregate stats ─────────────────────────────────────────────────── */
  .stats {
    margin-top: 56px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-md);
    overflow: hidden;
    background: var(--k-surface-1);
  }
  .stat {
    padding: 24px 22px 22px;
    position: relative;
  }
  .stat + .stat {
    border-left: 1px solid var(--k-line-1);
  }
  .stat::before {
    content: '';
    position: absolute;
    top: 0;
    left: 22px;
    right: 22px;
    height: 2px;
    background: var(--k-ink-1);
    opacity: 0.85;
  }
  .stat:nth-child(3)::before {
    background: var(--k-yamabuki);
  }
  .stat-label {
    font-family: var(--k-font-mono);
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--k-ink-3);
    margin: 0 0 14px;
  }
  .stat-figure {
    font-family: var(--k-font-display);
    font-variation-settings:
      'opsz' 144,
      'SOFT' 50;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.03em;
    margin: 0;
    color: var(--k-ink-1);
    font-variant-numeric: tabular-nums;
  }
  .stat-figure.tight-fig {
    color: var(--k-yamabuki);
    font-style: italic;
  }
  :global([data-theme='dark']) .stat-figure.tight-fig {
    color: var(--k-yamabuki);
  }
  .stat-foot {
    font-size: 12.5px;
    color: var(--k-ink-3);
    margin: 12px 0 0;
    line-height: 1.4;
  }
  .stat-foot span {
    color: var(--k-ink-2);
    font-variant-numeric: tabular-nums;
  }
  .stat-foot code {
    font-size: 11px;
    color: var(--k-ink-2);
    background: var(--k-surface-2);
    padding: 1px 6px;
    border-radius: 3px;
  }

  /* ── Filter bar ──────────────────────────────────────────────────────── */
  .filterbar {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .filter-group {
    display: inline-flex;
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    background: var(--k-surface-1);
    overflow: hidden;
  }
  .filter-btn {
    appearance: none;
    background: transparent;
    border: 0;
    border-left: 1px solid var(--k-line-1);
    padding: 8px 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--k-font-sans);
    font-size: 13px;
    color: var(--k-ink-3);
    cursor: pointer;
    transition:
      background var(--k-dur-fast),
      color var(--k-dur-fast);
  }
  .filter-btn:first-child {
    border-left: 0;
  }
  .filter-btn:hover {
    color: var(--k-ink-1);
    background: var(--k-surface-2);
  }
  .filter-btn:focus-visible {
    outline: 2px solid var(--k-focus);
    outline-offset: -2px;
  }
  .filter-btn.active {
    color: var(--k-surface-0);
    background: var(--k-ink-1);
  }
  .filter-btn.active.b-safe {
    background: var(--k-matcha-ink);
  }
  .filter-btn.active.b-tight {
    background: var(--k-yamabuki);
    color: var(--k-ink-1);
  }
  .filter-btn.active.b-fail {
    background: var(--k-shu);
    color: white;
  }
  .f-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.7;
  }
  .filter-btn.b-safe .f-dot {
    background: var(--k-matcha);
    opacity: 1;
  }
  .filter-btn.b-tight .f-dot {
    background: var(--k-yamabuki);
    opacity: 1;
  }
  .filter-btn.b-fail .f-dot {
    background: var(--k-shu);
    opacity: 1;
  }
  .filter-btn.active .f-dot {
    background: currentColor;
    opacity: 1;
  }
  .f-count {
    font-family: var(--k-font-mono);
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 999px;
    background: color-mix(in oklab, currentColor 12%, transparent);
    font-variant-numeric: tabular-nums;
  }
  .filter-btn.active .f-count {
    background: color-mix(in oklab, currentColor 22%, transparent);
  }
  .filter-hint {
    font-family: var(--k-font-mono);
    font-size: 11px;
    color: var(--k-ink-4);
    letter-spacing: 0.04em;
    margin: 0;
  }

  /* ── Packages ────────────────────────────────────────────────────────── */
  .packages {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }
  .pkg {
    position: relative;
    background: var(--k-surface-1);
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-md);
    overflow: hidden;
  }
  .pkg::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--k-ink-1);
    opacity: 0.85;
  }
  .pkg-head {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: 18px;
    padding: 18px 22px 16px 22px;
    border-bottom: 1px dashed var(--k-line-2);
    background: linear-gradient(
      to right,
      color-mix(in oklab, var(--k-shu-soft) 35%, var(--k-surface-1)),
      var(--k-surface-1) 60%
    );
  }
  :global([data-theme='dark']) .pkg-head {
    background: linear-gradient(
      to right,
      color-mix(in oklab, var(--k-shu-soft) 25%, var(--k-surface-1)),
      var(--k-surface-1) 60%
    );
  }
  .pkg-tab {
    font-family: var(--k-font-display);
    font-style: italic;
    font-size: 28px;
    color: var(--k-shu-ink);
    font-variation-settings:
      'opsz' 144,
      'SOFT' 70;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  :global([data-theme='dark']) .pkg-tab {
    color: var(--k-shu);
  }
  .pkg-id {
    min-width: 0;
  }
  .pkg-name {
    font-family: var(--k-font-mono);
    font-size: 15px;
    font-weight: 500;
    margin: 0;
    color: var(--k-ink-1);
    letter-spacing: -0.01em;
  }
  .pkg-dir {
    margin: 4px 0 0;
    font-size: 11.5px;
    color: var(--k-ink-4);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .pkg-dir .lbl {
    font-family: var(--k-font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 9.5px;
    color: var(--k-ink-5);
  }
  .pkg-dir code {
    font-family: var(--k-font-mono);
    color: var(--k-ink-3);
    background: transparent;
    padding: 0;
  }

  .pkg-pills {
    display: inline-flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--k-font-mono);
    font-size: 11px;
    padding: 4px 9px;
    border-radius: 999px;
    border: 1px solid;
    line-height: 1;
  }
  .pill .p-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: currentColor;
  }
  .p-safe {
    color: var(--k-matcha-ink);
    border-color: color-mix(in oklab, var(--k-matcha) 30%, transparent);
    background: var(--k-matcha-soft);
  }
  .p-tight {
    color: oklch(0.42 0.13 75);
    border-color: color-mix(in oklab, var(--k-yamabuki) 45%, transparent);
    background: var(--k-yamabuki-soft);
  }
  :global([data-theme='dark']) .p-tight {
    color: var(--k-yamabuki);
  }
  .p-fail {
    color: var(--k-shu-ink);
    border-color: color-mix(in oklab, var(--k-shu) 35%, transparent);
    background: var(--k-shu-soft);
  }
  :global([data-theme='dark']) .p-fail {
    color: var(--k-shu);
  }

  /* ── Entry rows ──────────────────────────────────────────────────────── */
  .entries {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .entry {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto minmax(260px, 360px);
    align-items: center;
    gap: 24px;
    padding: 14px 22px;
    border-top: 1px solid var(--k-line-1);
    transition: background var(--k-dur-fast);
  }
  .entry:first-child {
    border-top: 0;
  }
  .entry:hover {
    background: var(--k-surface-2);
  }
  .entry-meta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .status {
    display: inline-grid;
    place-items: center;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    font-family: var(--k-font-mono);
    font-size: 11px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .entry.safe .status {
    background: var(--k-matcha-soft);
    color: var(--k-matcha-ink);
  }
  .entry.tight .status {
    background: var(--k-yamabuki-soft);
    color: oklch(0.42 0.13 75);
  }
  :global([data-theme='dark']) .entry.tight .status {
    color: var(--k-yamabuki);
  }
  .entry.fail .status {
    background: var(--k-shu-soft);
    color: var(--k-shu-ink);
  }
  :global([data-theme='dark']) .entry.fail .status {
    color: var(--k-shu);
  }
  .entry-name {
    font-family: var(--k-font-mono);
    font-size: 13px;
    color: var(--k-ink-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .entry-nums {
    font-family: var(--k-font-mono);
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    display: inline-flex;
    align-items: baseline;
    gap: 7px;
  }
  .entry-nums .size {
    color: var(--k-ink-1);
    font-weight: 500;
  }
  .entry-nums .num-sep {
    color: var(--k-ink-5);
  }
  .entry-nums .limit {
    color: var(--k-ink-4);
  }

  /* ── Ruler (gauge) ───────────────────────────────────────────────────── */
  .entry-gauge {
    min-width: 0;
  }
  .ruler {
    position: relative;
    height: 26px;
    width: 100%;
    background: var(--measure-grid);
    border: 1px solid var(--k-line-1);
    border-radius: 2px;
    overflow: hidden;
    font-variant-numeric: tabular-nums;
  }
  .ruler-fill {
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--pct);
    background: linear-gradient(
      to bottom,
      color-mix(in oklab, var(--gauge-color, var(--k-matcha)) 95%, white 5%),
      var(--gauge-color, var(--k-matcha))
    );
    transition: width var(--k-dur-slow) var(--k-ease-out);
  }
  .entry.safe .ruler {
    --gauge-color: var(--k-matcha);
  }
  .entry.tight .ruler {
    --gauge-color: var(--k-yamabuki);
  }
  .entry.fail .ruler {
    --gauge-color: var(--k-shu);
  }
  .ruler-marks {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .tick {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: color-mix(in oklab, var(--k-ink-1) 22%, transparent);
    transform: translateX(-0.5px);
  }
  .tick::after {
    content: '';
    position: absolute;
    left: -1px;
    top: 0;
    width: 3px;
    height: 4px;
    background: color-mix(in oklab, var(--k-ink-1) 35%, transparent);
  }
  .tick-major {
    background: color-mix(in oklab, var(--k-ink-1) 60%, transparent);
  }
  .tick-major::after {
    height: 6px;
    background: color-mix(in oklab, var(--k-ink-1) 60%, transparent);
  }
  .tick-threshold {
    background: var(--k-yamabuki);
    opacity: 0.55;
  }
  .tick-threshold::after {
    background: var(--k-yamabuki);
    height: 100%;
    width: 1px;
    top: 0;
    left: 0;
  }
  .ruler-pct {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    font-family: var(--k-font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--k-ink-1);
    background: color-mix(in oklab, var(--k-surface-0) 78%, transparent);
    padding: 1px 6px;
    border-radius: 3px;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .ruler-pct i {
    font-style: normal;
    color: var(--k-ink-4);
    font-weight: 500;
    margin-left: 1px;
  }

  /* ── Colophon ────────────────────────────────────────────────────────── */
  .colophon {
    margin-top: 56px;
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: var(--k-font-mono);
    font-size: 11.5px;
    color: var(--k-ink-4);
    letter-spacing: 0.04em;
  }
  .colophon-rule {
    flex: 1;
    height: 1px;
    background: var(--k-line-2);
  }
  .colophon code {
    background: var(--k-surface-2);
    padding: 1px 6px;
    border-radius: 3px;
    color: var(--k-ink-3);
  }
  .colophon a {
    color: var(--k-ink-2);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: var(--k-shu);
  }

  /* ── Responsive ──────────────────────────────────────────────────────── */
  @media (max-width: 880px) {
    .masthead {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .mast-right {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .stamp {
      text-align: left;
    }
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
    .stat + .stat {
      border-left: 1px solid var(--k-line-1);
    }
    .stat:nth-child(3),
    .stat:nth-child(4) {
      border-top: 1px solid var(--k-line-1);
    }
    .stat:nth-child(3) {
      border-left: 0;
    }
    .entry {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .entry-nums {
      justify-self: start;
    }
    .pkg-head {
      grid-template-columns: 40px 1fr;
    }
    .pkg-pills {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }

  @media (max-width: 540px) {
    .ledger {
      padding: 40px 16px 64px;
    }
    .stats {
      grid-template-columns: 1fr;
    }
    .stat + .stat {
      border-left: 0;
      border-top: 1px solid var(--k-line-1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ruler-fill {
      transition: none;
    }
  }
</style>
