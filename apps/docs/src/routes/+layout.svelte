<script lang="ts">
  import Search from '$lib/Search.svelte';

  let { children } = $props();
</script>

<header>
  <a href="/">Kumiki</a>
  <nav>
    <a href="/docs/getting-started">Docs</a>
    <a href="/components">Components</a>
    <a href="/sizes">Sizes</a>
    <a href="/sizes/compare">Compare</a>
    <a href="/llms.txt">llms.txt</a>
    <a href="https://github.com/baseballyama/kumiki">GitHub</a>
  </nav>
  <div class="search-slot">
    <Search />
  </div>
</header>

<main>
  {@render children()}
</main>

<footer>
  <small>Kumiki · MIT · Pre-alpha</small>
</footer>

<style>
  header {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid oklch(0.92 0 0);
  }
  .search-slot {
    margin-inline-start: auto;
    width: min(20rem, 100%);
  }
  nav {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
  }
  footer {
    padding: 1.25rem;
    border-top: 1px solid oklch(0.92 0 0);
    color: oklch(0.5 0 0);
  }
</style>
