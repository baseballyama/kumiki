<!--
  Atelier Dialog sandbox — exercises both Tailwind and Vanilla CSS variants.
-->
<script lang="ts">
  import { Tailwind, Vanilla } from '@kumiki/atelier/dialog';
  import { page } from '$app/state';

  const variant = $derived(
    page.url.searchParams.get('variant') === 'tailwind' ? 'tailwind' : 'vanilla',
  );

  let openA = $state(false);
  let openB = $state(false);
</script>

<svelte:head>
  <title>Atelier Dialog sandbox</title>
</svelte:head>

<main class="page">
  <h1>Atelier Dialog ({variant})</h1>
  <p>
    Layer 5 preview — copy-paste-friendly styled Dialog from
    <code>@kumiki/atelier/dialog</code>.
  </p>

  {#if variant === 'tailwind'}
    <Tailwind.Root bind:open={openA}>
      <Tailwind.Trigger>Open Tailwind dialog</Tailwind.Trigger>
      <Tailwind.Overlay />
      <Tailwind.Content>
        <Tailwind.Title>Are you sure?</Tailwind.Title>
        <Tailwind.Description>
          This action will permanently delete the workspace. It cannot be undone.
        </Tailwind.Description>
        <div class="row">
          <Tailwind.Close>Cancel</Tailwind.Close>
          <Tailwind.Close>Delete</Tailwind.Close>
        </div>
      </Tailwind.Content>
    </Tailwind.Root>
  {:else}
    <Vanilla.Root bind:open={openB}>
      <Vanilla.Trigger>Open Vanilla dialog</Vanilla.Trigger>
      <Vanilla.Overlay />
      <Vanilla.Content>
        <Vanilla.Title>Are you sure?</Vanilla.Title>
        <Vanilla.Description>
          This action will permanently delete the workspace. It cannot be undone.
        </Vanilla.Description>
        <div class="row">
          <Vanilla.Close>Cancel</Vanilla.Close>
          <Vanilla.Close>Delete</Vanilla.Close>
        </div>
      </Vanilla.Content>
    </Vanilla.Root>
  {/if}

  <p data-testid="state">open = {variant === 'tailwind' ? openA : openB}</p>
</main>

<style>
  .page {
    padding: 2rem;
    font-family: system-ui, sans-serif;
  }
  .row {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
</style>
