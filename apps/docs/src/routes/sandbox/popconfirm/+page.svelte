<!--
  Popconfirm sandbox — Playwright + axe fixture.

  Query params:
    ?initial=open
    ?escape=0
    ?outside=0
    ?variant=neutral|danger
    ?dir=rtl
-->
<script lang="ts">
  import { Popconfirm } from '@kumiki/components/popover/with-confirm';
  import { Trigger as PopoverTrigger } from '@kumiki/components/popover';
  import { page } from '$app/state';

  const initialOpen = $derived(page.url.searchParams.get('initial') === 'open');
  const closeOnEscape = $derived(page.url.searchParams.get('escape') !== '0');
  const closeOnOutsideClick = $derived(page.url.searchParams.get('outside') !== '0');
  const variant = $derived(
    (page.url.searchParams.get('variant') ?? 'neutral') as 'neutral' | 'danger',
  );
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // svelte-ignore state_referenced_locally
  let open = $state(initialOpen);
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Popconfirm sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="popconfirm" data-testid="sandbox">
  <h1>Popconfirm sandbox</h1>

  <div data-testid="popconfirm-host">
    <Popconfirm.Root
      bind:open
      {closeOnEscape}
      {closeOnOutsideClick}
      {variant}
      onConfirm={() => append('onConfirm')}
      onCancel={() => append('onCancel')}
      onOpenChange={(v) => append(`onOpenChange(${v})`)}
    >
      <PopoverTrigger data-testid="trigger">Delete</PopoverTrigger>
      <Popconfirm.Content data-testid="content">
        <Popconfirm.Message>This cannot be undone.</Popconfirm.Message>
        <Popconfirm.Cancel data-testid="cancel" />
        <Popconfirm.Confirm data-testid="confirm">Delete</Popconfirm.Confirm>
      </Popconfirm.Content>
    </Popconfirm.Root>
  </div>

  <p data-testid="state">
    open: <strong data-testid="open">{open}</strong>
    · variant: <strong data-testid="variant">{variant}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
