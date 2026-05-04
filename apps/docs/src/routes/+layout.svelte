<script lang="ts">
  let { children } = $props();
</script>

<header>
  <a href="/">Kumiki</a>
  <nav>
    <a href="/docs/getting-started">Docs</a>
    <a href="/components">Components</a>
    <a href="/sizes">Sizes</a>
    <a href="/llms.txt">llms.txt</a>
    <a href="https://github.com/baseballyama/kumiki">GitHub</a>
  </nav>
</header>

<main>
  {@render children()}
</main>

<footer>
  <small>Kumiki · MIT · Pre-alpha</small>
</footer>
