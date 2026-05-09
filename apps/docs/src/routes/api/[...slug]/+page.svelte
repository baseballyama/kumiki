<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.slug} · Kumiki API</title>
</svelte:head>

<section>
  <p class="breadcrumb"><a href="/api">API reference</a> / <code>{data.slug}</code></p>

  <!--
    The TypeDoc-emitted markdown is rendered as preformatted text rather than
    parsed-and-injected HTML. A dedicated markdown pipeline (e.g. mdsvex or
    marked + DOMPurify) lands in v1.1; for v1.0 we stay safe and explicit.
  -->
  <pre class="markdown">{data.markdown}</pre>
</section>

<style>
  section {
    max-width: 56rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, sans-serif;
  }
  .breadcrumb {
    color: oklch(0.5 0 0);
    font-size: 0.875rem;
    margin-block-end: 1rem;
  }
  .breadcrumb a {
    color: inherit;
    text-decoration: underline;
  }
  pre.markdown {
    white-space: pre-wrap;
    font-size: 0.875rem;
    line-height: 1.6;
    background: oklch(0.97 0 0);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
  }
</style>
