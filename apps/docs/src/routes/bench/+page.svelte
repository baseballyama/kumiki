<script lang="ts">
  import { asset } from '$app/paths';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const benches = $derived(data.benches);

  function formatHz(hz: number): string {
    if (hz >= 1e6) return `${(hz / 1e6).toFixed(2)} M ops/s`;
    if (hz >= 1e3) return `${(hz / 1e3).toFixed(1)} K ops/s`;
    return `${hz.toFixed(0)} ops/s`;
  }

  function formatMicros(seconds: number): string {
    const us = seconds * 1e6;
    if (us < 1) return `${(us * 1000).toFixed(0)} ns`;
    return `${us.toFixed(2)} µs`;
  }

  const generatedLabel = $derived(
    benches
      ? new Date(benches.generatedAt).toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
      : '',
  );
</script>

<svelte:head>
  <title>Benchmarks · Kumiki</title>
</svelte:head>

<section>
  <h1>Benchmarks</h1>
  {#if !benches}
    <p>
      No benchmark snapshot yet. Run <code>pnpm -w run bench:json</code> at the repo root to
      populate
      <code>/benches.json</code>.
    </p>
  {:else}
    <p class="meta">
      Per-bench ops/sec from vitest's <code>bench</code> mode (tinybench under the hood). Run on the
      maintainer's machine — numbers are machine-dependent and intended for trend tracking,
      <strong>not</strong>
      as a CI gate. Generated <strong>{generatedLabel}</strong>. Raw JSON at
      <a href={asset('/benches.json')}><code>/benches.json</code></a>.
    </p>

    {#each benches.packages as pkg (pkg.package)}
      <article class="pkg">
        <header>
          <code class="name">{pkg.package}</code>
          <span class="dir"><code>{pkg.directory}</code></span>
        </header>
        {#each pkg.groups as group (group.name)}
          <div class="group">
            <h3>{group.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>bench</th>
                  <th class="num">ops/sec</th>
                  <th class="num">mean</th>
                  <th class="num">p99</th>
                  <th class="num">±rme</th>
                </tr>
              </thead>
              <tbody>
                {#each group.benches as bench (bench.name)}
                  <tr>
                    <td>{bench.name}</td>
                    <td class="num">{formatHz(bench.hz)}</td>
                    <td class="num">{formatMicros(bench.mean)}</td>
                    <td class="num">{formatMicros(bench.p99)}</td>
                    <td class="num">±{bench.rme.toFixed(2)}%</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/each}
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
  .group {
    border-top: 1px solid #2a2a4a;
  }
  .group h3 {
    margin: 0;
    padding: 12px 16px 4px;
    font-size: 13px;
    color: #aaa;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 8px 16px;
    text-align: left;
    font-size: 13px;
    border-top: 1px solid #1f1f3a;
  }
  th {
    color: #888;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  td.num,
  th.num {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
</style>
