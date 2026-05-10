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
  <title>Size and a11y comparison · Kumiki</title>
  <meta
    name="description"
    content="Bundle size and accessibility-feature comparison for Kumiki vs Bits UI / Melt UI / Radix / React Aria / Zag.js / Headless UI — measured kumiki numbers from size-limit, competitor numbers from market research, plus a feature matrix for Standard Schema, non-Gregorian calendars, RTL keyboard, APG tests, and screen-reader CI."
  />
</svelte:head>

<section>
  <h1>Bundle size and a11y comparison</h1>

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

  <h2>Accessibility & i18n features</h2>
  <p class="meta">
    Headline capabilities each library ships out of the box. Sourced from
    <a href="/docs/market-research"><code>docs/market-research.md</code></a> §4.5–§7. As of
    <time>{compare.featureMatrix.asOf}</time>.
  </p>

  <table class="features">
    <thead>
      <tr>
        <th scope="col">Feature</th>
        {#each compare.featureMatrix.libraries as lib (lib)}
          <th scope="col" class:kumiki-col={lib === 'Kumiki'}>{lib}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each compare.featureMatrix.rows as row (row.feature)}
        <tr>
          <th scope="row">
            {row.feature}
            {#if row.note}<small class="note">{row.note}</small>{/if}
          </th>
          {#each row.values as cell, i (compare.featureMatrix.libraries[i])}
            {@const isKumikiCol = compare.featureMatrix.libraries[i] === 'Kumiki'}
            <td class="cell" class:kumiki-col={isKumikiCol} data-cell={cell}>
              {#if cell === 'yes'}<span class="mark mark-yes" aria-label="yes">✓</span>
              {:else if cell === 'no'}<span class="mark mark-no" aria-label="no">·</span>
              {:else if cell === 'partial'}<span class="mark mark-partial" aria-label="partial"
                  >◐</span
                >
              {:else if cell === 'manual'}<span class="mark mark-manual" aria-label="manual only"
                  >◑</span
                >
              {:else}<span class="mark mark-text">{cell}</span>{/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <p class="meta">
    Legend: <span class="mark mark-yes">✓</span> shipped &nbsp;
    <span class="mark mark-partial">◐</span> partial &nbsp;
    <span class="mark mark-manual">◑</span> manual only / opt-in &nbsp;
    <span class="mark mark-no">·</span> not provided
  </p>

  <h2>Caveats</h2>
  <ul>
    {#each compare.caveats as caveat (caveat)}
      <li>{caveat}</li>
    {/each}
  </ul>

  <p class="meta">
    Bundle data last updated: <time>{compare.generatedAt}</time>. Feature matrix as of
    <time>{compare.featureMatrix.asOf}</time>. Source data:
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
  table.features {
    table-layout: fixed;
  }
  table.features th[scope='row'] {
    text-align: left;
    font-weight: 500;
    width: 30%;
  }
  table.features th.kumiki-col,
  table.features td.kumiki-col {
    background: oklch(0.97 0.02 252);
  }
  table.features td.cell {
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
  small.note {
    display: block;
    margin-block-start: 0.15rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: oklch(0.5 0 0);
    line-height: 1.4;
  }
  .mark {
    display: inline-block;
    min-width: 1.4rem;
    text-align: center;
    font-size: 1rem;
    line-height: 1;
  }
  .mark-yes {
    color: oklch(0.55 0.16 145);
    font-weight: 700;
  }
  .mark-partial {
    color: oklch(0.6 0.13 75);
  }
  .mark-manual {
    color: oklch(0.55 0.1 240);
  }
  .mark-no {
    color: oklch(0.6 0 0);
  }
  .mark-text {
    font-size: 0.8125rem;
    font-weight: 500;
    color: oklch(0.3 0 0);
  }
</style>
