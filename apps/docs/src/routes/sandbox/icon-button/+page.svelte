<!--
  IconButton sandbox — Playwright + axe fixture.

  Query params:
    ?disabled=1   start disabled
    ?loading=1    start in loading state
    ?variant=primary|secondary|ghost|danger (default ghost)
    ?size=sm|md|lg
    ?dir=rtl
-->
<script lang="ts">
  import {
    IconButton,
    type IconButtonVariant,
    type IconButtonSize,
  } from '@kumiki/components/icon-button';
  import { page } from '$app/state';

  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const loading = $derived(page.url.searchParams.get('loading') === '1');
  const variant = $derived((page.url.searchParams.get('variant') ?? 'ghost') as IconButtonVariant);
  const size = $derived((page.url.searchParams.get('size') ?? 'md') as IconButtonSize);
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>IconButton sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="icon-button" data-testid="sandbox">
  <h1>IconButton sandbox</h1>

  <div data-testid="icon-button-host">
    <IconButton.Root
      aria-label="Close"
      {disabled}
      {loading}
      {variant}
      {size}
      onclick={() => append('clicked')}
    >
      {#snippet icon()}
        <span aria-hidden="true">×</span>
      {/snippet}
    </IconButton.Root>
  </div>

  <p data-testid="state">
    variant: <strong data-testid="variant">{variant}</strong>
    · size: <strong data-testid="size">{size}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
