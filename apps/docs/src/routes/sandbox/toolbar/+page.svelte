<!--
  Toolbar sandbox — Playwright + axe fixture.

  Query params:
    ?orientation=horizontal|vertical
    ?disabled=1
    ?dir=rtl
-->
<script lang="ts">
  import { Toolbar, type ToolbarOrientation } from '@kumiki/components/toolbar';
  import { page } from '$app/state';

  const orientation = $derived(
    (page.url.searchParams.get('orientation') ?? 'horizontal') as ToolbarOrientation,
  );
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Toolbar sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="toolbar" data-testid="sandbox">
  <h1>Toolbar sandbox</h1>

  <div data-testid="toolbar-host">
    <Toolbar.Root {orientation} {disabled} aria-label="Editor actions">
      <Toolbar.Item data-testid="item-bold" onclick={() => append('Bold')}>Bold</Toolbar.Item>
      <Toolbar.Item data-testid="item-italic" onclick={() => append('Italic')}>Italic</Toolbar.Item>
      <Toolbar.Separator />
      <Toolbar.Item data-testid="item-link" onclick={() => append('Link')}>Link</Toolbar.Item>
    </Toolbar.Root>
  </div>

  <p data-testid="state">
    orientation: <strong data-testid="orientation">{orientation}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
