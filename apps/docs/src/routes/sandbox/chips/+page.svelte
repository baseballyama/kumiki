<!--
  Chips sandbox — Playwright + axe fixture.

  Query params:
    ?variant=static|dismissible|selectable
    ?initial=on (selectable: pressed=true)
    ?disabled=1 (selectable)
    ?dir=rtl
-->
<script lang="ts">
  import { Chips, type ChipsVariant } from '@kumiki/components/chips';
  import { page } from '$app/state';

  const variant = $derived((page.url.searchParams.get('variant') ?? 'static') as ChipsVariant);
  const initial = $derived(page.url.searchParams.get('initial') === 'on');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // svelte-ignore state_referenced_locally
  let pressed = $state(initial);
  // svelte-ignore state_referenced_locally
  let visible = $state(true);
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Chips sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="chips" data-testid="sandbox">
  <h1>Chips sandbox</h1>

  <div data-testid="chips-host">
    {#if variant === 'static'}
      <Chips.Root>
        <Chips.Label>design</Chips.Label>
      </Chips.Root>
    {:else if variant === 'dismissible' && visible}
      <Chips.Root
        variant="dismissible"
        label="design"
        onDismiss={() => {
          visible = false;
          append('onDismiss');
        }}
      >
        <Chips.Label>design</Chips.Label>
        <Chips.Close />
      </Chips.Root>
    {:else if variant === 'selectable'}
      <Chips.Root
        variant="selectable"
        {pressed}
        {disabled}
        onPressedChange={(v) => {
          pressed = v;
          append(`onPressedChange(${v})`);
        }}
      >
        <Chips.Label>design</Chips.Label>
      </Chips.Root>
    {/if}
  </div>

  <p data-testid="state">
    variant: <strong data-testid="variant">{variant}</strong>
    · pressed: <strong data-testid="pressed">{pressed}</strong>
    · visible: <strong data-testid="visible">{visible}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
