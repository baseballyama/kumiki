<!--
  Pagefind-powered docs search.

  Pagefind is a static search index built into apps/docs at build time
  (see apps/docs/package.json `postbuild`). The runtime UI here is a
  thin wrapper that loads `/pagefind/pagefind.js` lazily and queries it
  client-side.

  Hidden from SSR via `browser` guard; shows a loading state on the
  first interaction while the WASM-backed index loads (~20 KB gzip).
-->
<script lang="ts">
  import { browser } from '$app/environment';

  type SearchResult = {
    id: string;
    url: string;
    excerpt: string;
    meta: { title?: string };
  };

  // Pagefind global injected at runtime via dynamic import.
  let pagefind = $state<{
    search: (q: string) => Promise<{ results: Array<{ data: () => Promise<SearchResult> }> }>;
  } | null>(null);
  let query = $state('');
  let results = $state<SearchResult[]>([]);
  let pending = $state(false);
  let error = $state<string | null>(null);

  async function ensurePagefind(): Promise<void> {
    if (!browser || pagefind) return;
    try {
      // /pagefind/ is built by `pagefind --site` into the SvelteKit output;
      // adapter-cloudflare copies it to the deployed site root.
      // @ts-expect-error — /pagefind/pagefind.js is built by Pagefind at
      // postbuild time, after svelte-check has run. Unknown to the TS module
      // resolver during typecheck.
      const mod = await import(/* @vite-ignore */ '/pagefind/pagefind.js');
      pagefind = mod;
    } catch {
      error =
        'Search index not built yet. Run `pnpm --filter @kumiki/docs run build` to populate /pagefind/.';
    }
  }

  async function runSearch(): Promise<void> {
    pending = true;
    try {
      await ensurePagefind();
      if (!pagefind || !query) {
        results = [];
        return;
      }
      const r = await pagefind.search(query);
      results = await Promise.all(r.results.slice(0, 10).map((row) => row.data()));
    } finally {
      pending = false;
    }
  }

  let debounce: ReturnType<typeof setTimeout> | null = null;
  function onInput(e: Event): void {
    query = (e.target as HTMLInputElement).value;
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(runSearch, 200);
  }
</script>

<form role="search" onsubmit={(e) => e.preventDefault()}>
  <label for="kumiki-search-input" class="sr-only">Search the docs</label>
  <input
    id="kumiki-search-input"
    type="search"
    placeholder="Search docs…"
    autocomplete="off"
    oninput={onInput}
  />

  {#if error}
    <p class="error">{error}</p>
  {:else if pending}
    <p class="meta">Searching…</p>
  {:else if results.length > 0}
    <ul>
      {#each results as r (r.id)}
        <li>
          <a href={r.url}>
            <strong>{r.meta?.title ?? r.url}</strong>
            <span class="excerpt">{@html r.excerpt}</span>
          </a>
        </li>
      {/each}
    </ul>
  {:else if query.length > 0 && !pending}
    <p class="meta">No results for "{query}".</p>
  {/if}
</form>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  input {
    width: 100%;
    height: 2.25rem;
    padding-inline: 0.75rem;
    border: 1px solid oklch(0.85 0 0);
    border-radius: 0.375rem;
    font: inherit;
    font-size: 0.875rem;
  }
  input:focus-visible {
    outline: 2px solid oklch(0.55 0.18 252);
    outline-offset: 1px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid oklch(0.92 0 0);
    border-radius: 0.375rem;
    max-height: 24rem;
    overflow-y: auto;
  }
  li + li {
    border-top: 1px solid oklch(0.95 0 0);
  }
  li a {
    display: block;
    padding: 0.5rem 0.75rem;
    color: inherit;
    text-decoration: none;
  }
  li a:hover {
    background: oklch(0.97 0 0);
  }
  .excerpt {
    display: block;
    font-size: 0.8125rem;
    color: oklch(0.5 0 0);
    margin-top: 0.125rem;
  }
  .meta,
  .error {
    color: oklch(0.5 0 0);
    font-size: 0.875rem;
    margin: 0.25rem 0;
  }
  .error {
    color: oklch(0.5 0.18 25);
  }
</style>
