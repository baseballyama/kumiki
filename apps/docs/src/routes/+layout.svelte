<script lang="ts">
  import '$lib/styles/global.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { ui } from '$lib/i18n/store.svelte.js';

  let { children } = $props();

  // Re-sync <html> attributes after navigation in case anything else changes them.
  $effect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', ui.theme);
    document.documentElement.setAttribute('lang', ui.locale);
    document.documentElement.setAttribute('dir', ui.direction);
  });
</script>

<Header />

<main id="main" tabindex="-1">
  {@render children()}
</main>

<Footer />

<style>
  main {
    min-height: 70vh;
    outline: none;
  }
</style>
