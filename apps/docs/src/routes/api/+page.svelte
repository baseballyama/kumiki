<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>API reference · Kumiki</title>
</svelte:head>

<section>
  <h1>API reference</h1>
  <p class="meta">
    Auto-generated from JSDoc by <a href="https://typedoc.org">TypeDoc</a>. Run
    <code>pnpm typedoc</code> at the repo root to refresh. Source of truth is the package's published
    types — this page is a snapshot at build time.
  </p>

  <ul>
    {#each data.entries as entry (entry.slug)}
      <li>
        <a href={`/api/${entry.slug}`}><code>{entry.display}</code></a>
      </li>
    {/each}
  </ul>
</section>

<style>
  section {
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, sans-serif;
  }
  .meta {
    color: oklch(0.5 0 0);
    font-size: 0.875rem;
    line-height: 1.6;
  }
  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }
  li {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid oklch(0.95 0 0);
  }
  li a {
    color: inherit;
    text-decoration: none;
  }
  li a:hover {
    text-decoration: underline;
  }
  code {
    font-size: 0.875em;
  }
</style>
