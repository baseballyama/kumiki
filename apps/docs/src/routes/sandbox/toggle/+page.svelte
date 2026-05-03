<!--
  Toggle sandbox — minimal fixture used by the Playwright + axe + (eventually) Guidepup
  test suites. Designed to be deterministic: query parameters drive initial state.

  Query params:
    ?initial=on           initial pressed=true
    ?disabled=1           start disabled
    ?dir=rtl              wrap in dir="rtl"
-->
<script lang="ts">
  import { Toggle } from '@kumiki/component-toggle';
  import { page } from '$app/state';

  const initial = $derived(page.url.searchParams.get('initial') === 'on');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // `initial` is captured into local state once at mount; subsequent URL changes
  // do not retroactively flip the toggle (would surprise users in dev).
  // svelte-ignore state_referenced_locally
  let pressed = $state(initial);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Toggle sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="toggle" data-testid="sandbox">
  <h1>Toggle sandbox</h1>

  <div data-testid="toggle-host">
    <Toggle.Root bind:pressed {disabled} onPressedChange={(v) => append(`onPressedChange(${v})`)}>
      {pressed ? 'On' : 'Off'}
    </Toggle.Root>
  </div>

  <p data-testid="state">
    pressed: <strong data-testid="pressed">{pressed}</strong> · disabled:
    <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-set-true" type="button" onclick={() => (pressed = true)}>
    Externally set pressed=true
  </button>
  <button data-testid="ext-set-false" type="button" onclick={() => (pressed = false)}>
    Externally set pressed=false
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line}
      <li>{line}</li>
    {/each}
  </ol>
</div>
