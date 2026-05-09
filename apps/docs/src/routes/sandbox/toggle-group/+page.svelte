<!--
  Toggle.Group sandbox — Playwright + axe fixture.

  Query params:
    ?mode=multiple|single (default multiple)
    ?disabled=1
    ?dir=rtl
-->
<script lang="ts">
  import { Toggle, type ToggleGroupMode } from '@kumiki/components/toggle';
  import { page } from '$app/state';

  const mode = $derived((page.url.searchParams.get('mode') ?? 'multiple') as ToggleGroupMode);
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  let multiple = $state<string[]>([]);
  let single = $state<string | null>(null);
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Toggle.Group sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="toggle-group" data-testid="sandbox">
  <h1>Toggle.Group sandbox</h1>

  <div data-testid="toggle-group-host">
    {#if mode === 'multiple'}
      <Toggle.Group
        mode="multiple"
        value={multiple}
        {disabled}
        aria-label="Text style"
        onValueChange={(v) => {
          multiple = v;
          append(`onValueChange(${JSON.stringify(v)})`);
        }}
      >
        <Toggle.GroupItem value="bold" data-testid="item-bold">B</Toggle.GroupItem>
        <Toggle.GroupItem value="italic" data-testid="item-italic">I</Toggle.GroupItem>
        <Toggle.GroupItem value="underline" data-testid="item-underline">U</Toggle.GroupItem>
      </Toggle.Group>
    {:else}
      <Toggle.Group
        mode="single"
        value={single}
        {disabled}
        aria-label="Alignment"
        onValueChange={(v) => {
          single = v;
          append(`onValueChange(${JSON.stringify(v)})`);
        }}
      >
        <Toggle.GroupItem value="left" data-testid="item-left">L</Toggle.GroupItem>
        <Toggle.GroupItem value="center" data-testid="item-center">C</Toggle.GroupItem>
        <Toggle.GroupItem value="right" data-testid="item-right">R</Toggle.GroupItem>
      </Toggle.Group>
    {/if}
  </div>

  <p data-testid="state">
    mode: <strong data-testid="mode">{mode}</strong>
    · multiple: <strong data-testid="multiple">{multiple.join(',') || 'none'}</strong>
    · single: <strong data-testid="single">{single ?? 'none'}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
