<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  const compare = $derived(data.compare);

  function formatBytes(n: number): string {
    if (n < 1024) return `${n} B`;
    return `${(n / 1024).toFixed(1)} KB`;
  }

  function relativeBar(rows: ReadonlyArray<{ gzip: number }>, value: number): number {
    const max = Math.max(...rows.map((r) => r.gzip));
    return Math.round((value / max) * 100);
  }

  function isKumiki(row: { library: string }): boolean {
    return row.library === 'Kumiki';
  }
</script>

<svelte:head>
  <title>Size comparison · Kumiki</title>
</svelte:head>

<section>
  <h1>Bundle size comparison</h1>

  <p class="meta">
    {compare.methodology}
  </p>

  {#each compare.components as comp (comp.component)}
    <article>
      <h2>{comp.component}</h2>
      <p class="subpath">
        Kumiki subpath: <code>{comp.kumikiSubpath}</code>
      </p>

      <table>
        <thead>
          <tr>
            <th scope="col">Library</th>
            <th scope="col">Version</th>
            <th scope="col">Framework</th>
            <th scope="col" class="num">gzip</th>
            <th scope="col">Bar</th>
          </tr>
        </thead>
        <tbody>
          {#each comp.rows as row (row.library)}
            <tr class:kumiki={isKumiki(row)}>
              <td>{row.library}</td>
              <td><code>{row.version}</code></td>
              <td>{row.framework}</td>
              <td class="num">{formatBytes(row.gzip)}</td>
              <td class="bar-cell">
                <span
                  class="bar"
                  class:kumiki-bar={isKumiki(row)}
                  style="width: {relativeBar(comp.rows, row.gzip)}%"
                ></span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </article>
  {/each}

  <h2>Caveats</h2>
  <ul>
    {#each compare.caveats as caveat (caveat)}
      <li>{caveat}</li>
    {/each}
  </ul>

  <p class="meta">
    Last updated: <time>{compare.generatedAt}</time>. Source data:
    <code>apps/docs/src/data/competitor-sizes.json</code>.
  </p>
</section>

<style>
  section {
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, sans-serif;
  }
  h1 {
    margin-block-end: 0.5rem;
  }
  h2 {
    margin-block: 1.5rem 0.5rem;
  }
  .meta {
    color: oklch(0.5 0 0);
    font-size: 0.875rem;
    line-height: 1.6;
  }
  .subpath {
    margin-block: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  article {
    margin-block-end: 2rem;
    padding-block-end: 1rem;
    border-bottom: 1px solid oklch(0.92 0 0);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  th,
  td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid oklch(0.95 0 0);
  }
  th {
    font-weight: 600;
    color: oklch(0.4 0 0);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  td.num,
  th.num {
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  td.bar-cell {
    width: 30%;
    padding: 0.25rem 0.5rem;
  }
  .bar {
    display: inline-block;
    height: 0.6rem;
    background: oklch(0.85 0.05 240);
    border-radius: 3px;
  }
  .kumiki {
    background: oklch(0.97 0.02 252);
  }
  .kumiki-bar {
    background: oklch(0.55 0.18 252);
  }
  ul {
    padding-inline-start: 1.5rem;
    line-height: 1.7;
  }
  code {
    font-size: 0.875em;
    background: oklch(0.96 0 0);
    padding: 0.05em 0.3em;
    border-radius: 3px;
  }
</style>
