<!--
  LoadingSpinner sandbox — axe smoke fixture (no keyboard interactions).

  Query params:
    ?dir=rtl
-->
<script lang="ts">
  import { LoadingSpinner } from '@kumiki/components/loading-spinner';
  import { page } from '$app/state';

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
</script>

<svelte:head>
  <title>LoadingSpinner sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="loading-spinner" data-testid="sandbox">
  <h1>LoadingSpinner sandbox</h1>

  <LoadingSpinner.Root>
    {#snippet spinner()}
      <span aria-hidden="true">⟳</span>
    {/snippet}
    <LoadingSpinner.Label>Loading…</LoadingSpinner.Label>
  </LoadingSpinner.Root>

  <p data-testid="state">dir: <strong data-testid="dir">{dir}</strong></p>
</div>
