<!--
  Atelier Toggle sandbox — exercises both Tailwind and Vanilla CSS variants
  side-by-side.

  Query params:
    ?variant=tailwind|vanilla   default: vanilla (no Tailwind in the docs site)
-->
<script lang="ts">
  import { Tailwind, Vanilla } from '@kumiki/atelier/toggle';
  import { page } from '$app/state';

  const variant = $derived(
    page.url.searchParams.get('variant') === 'tailwind' ? 'tailwind' : 'vanilla',
  );

  let pressed = $state(false);
</script>

<svelte:head>
  <title>Atelier Toggle sandbox</title>
</svelte:head>

<main class="page">
  <h1>Atelier Toggle ({variant})</h1>
  <p>
    Layer 5 preview — copy-paste-friendly styled Toggle from
    <code>@kumiki/atelier/toggle</code>.
  </p>

  <div class="row">
    {#if variant === 'tailwind'}
      <Tailwind bind:pressed>Bold</Tailwind>
      <Tailwind variant="outline" bind:pressed>Bold (outline)</Tailwind>
      <Tailwind size="sm" bind:pressed>sm</Tailwind>
      <Tailwind size="lg" bind:pressed>lg</Tailwind>
      <Tailwind disabled>disabled</Tailwind>
    {:else}
      <Vanilla bind:pressed>Bold</Vanilla>
      <Vanilla size="sm" bind:pressed>sm</Vanilla>
      <Vanilla size="lg" bind:pressed>lg</Vanilla>
      <Vanilla disabled>disabled</Vanilla>
    {/if}
  </div>

  <p data-testid="state">pressed = {pressed}</p>
</main>

<style>
  .page {
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }
  .row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    margin-block: 1rem;
  }
</style>
