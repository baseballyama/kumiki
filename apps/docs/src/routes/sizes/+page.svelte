<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const sizes = $derived(data.sizes);

  function formatBytes(n: number): string {
    if (n < 1024) return `${n} B`;
    return `${(n / 1024).toFixed(2)} kB`;
  }

  function pct(size: number, limit: number): number {
    return Math.round((size / limit) * 100);
  }

  function band(p: number): 'safe' | 'tight' | 'fail' {
    if (p >= 100) return 'fail';
    if (p >= 90) return 'tight';
    return 'safe';
  }

  const generatedLabel = $derived(
    sizes ? new Date(sizes.generatedAt).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : '',
  );
</script>

<svelte:head>
  <title>Bundle sizes · Kumiki</title>
</svelte:head>

<section>
  <h1>Bundle sizes</h1>
  {#if !sizes}
    <p>
      No measurements yet. Run <code>pnpm build:sizes</code> at the repo root to populate
      <code>/sizes.json</code>.
    </p>
  {:else}
    <p class="meta">
      Verified bundle measurements per package, brotli-compressed. Generated
      <strong>{generatedLabel}</strong>. Limits are enforced in CI via
      <a href="https://github.com/ai/size-limit">size-limit</a>; this view is just the rendered JSON
      at <a href="/sizes.json"><code>/sizes.json</code></a>.
    </p>

    {#each sizes.packages as pkg (pkg.package)}
      <article class="pkg">
        <header>
          <code class="name">{pkg.package}</code>
          <span class="dir"><code>{pkg.directory}</code></span>
        </header>
        <table>
          <thead>
            <tr>
              <th>entry</th>
              <th class="num">size</th>
              <th class="num">limit</th>
              <th class="num">used</th>
            </tr>
          </thead>
          <tbody>
            {#each pkg.entries as entry (entry.name)}
              {@const p = pct(entry.size, entry.sizeLimit)}
              {@const b = band(p)}
              <tr class={b}>
                <td>{entry.name}</td>
                <td class="num">{formatBytes(entry.size)}</td>
                <td class="num">{formatBytes(entry.sizeLimit)}</td>
                <td class="num">
                  <div class="bar" style:--pct="{Math.min(p, 100)}%">
                    <span>{p}%</span>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </article>
    {/each}
  {/if}
</section>

<style>
  section {
    max-width: 960px;
    padding: 24px 16px 64px;
  }
  h1 {
    margin: 8px 0 4px;
  }
  .meta {
    color: #888;
    font-size: 14px;
    margin-bottom: 24px;
    line-height: 1.5;
  }
  .pkg {
    margin: 24px 0;
    border: 1px solid #2a2a4a;
    border-radius: 10px;
    overflow: hidden;
  }
  .pkg header {
    background: #16162a;
    padding: 12px 16px;
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }
  .pkg .name {
    color: #4fc08d;
    font-weight: 600;
  }
  .pkg .dir {
    color: #777;
    font-size: 12px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 10px 16px;
    text-align: left;
    font-size: 14px;
    border-top: 1px solid #2a2a4a;
  }
  th {
    color: #888;
    font-weight: 500;
    background: #16162a;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  td.num,
  th.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  tbody tr.safe td:first-child::before {
    content: '✓ ';
    color: #4fc08d;
  }
  tbody tr.tight td:first-child::before {
    content: '! ';
    color: #ffa940;
  }
  tbody tr.fail td:first-child::before {
    content: '✘ ';
    color: #ff6b6b;
  }
  .bar {
    position: relative;
    background: #2a2a4a;
    border-radius: 3px;
    height: 18px;
    width: 120px;
    overflow: hidden;
    margin-left: auto;
    color: #fff;
    font-size: 11px;
    line-height: 18px;
    text-align: right;
    padding-right: 6px;
  }
  .bar::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--pct);
    background: #4fc08d;
  }
  .tight .bar::before {
    background: #ffa940;
  }
  .fail .bar::before {
    background: #ff6b6b;
  }
  .bar span {
    position: relative;
    z-index: 1;
  }
</style>
