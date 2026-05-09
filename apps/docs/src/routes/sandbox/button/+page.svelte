<!--
  Button sandbox — Playwright + axe fixture.

  Query params:
    ?disabled=1   start disabled
    ?loading=1    start in loading state
    ?variant=primary|secondary|ghost|danger
    ?size=sm|md|lg
    ?dir=rtl
-->
<script lang="ts">
  import { Button, type ButtonVariant, type ButtonSize } from '@kumiki/components/button';
  import { page } from '$app/state';

  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const loading = $derived(page.url.searchParams.get('loading') === '1');
  const variant = $derived((page.url.searchParams.get('variant') ?? 'primary') as ButtonVariant);
  const size = $derived((page.url.searchParams.get('size') ?? 'md') as ButtonSize);
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Button sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="button" data-testid="sandbox">
  <h1>Button sandbox</h1>

  <div data-testid="button-host">
    <Button.Root {disabled} {loading} {variant} {size} onclick={() => append('clicked')}>
      Save
    </Button.Root>
  </div>

  <p data-testid="state">
    variant: <strong data-testid="variant">{variant}</strong>
    · size: <strong data-testid="size">{size}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
    · loading: <strong data-testid="loading">{loading}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
