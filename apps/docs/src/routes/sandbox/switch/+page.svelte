<script lang="ts">
  import { Switch } from '@kumiki/components/switch';
  import { page } from '$app/state';

  const initial = $derived(page.url.searchParams.get('initial') === 'on');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // svelte-ignore state_referenced_locally
  let checked = $state(initial);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Switch sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="switch" data-testid="sandbox">
  <h1>Switch sandbox</h1>

  <div data-testid="switch-host">
    <Switch.Root bind:checked {disabled} onCheckedChange={(v) => append(`onCheckedChange(${v})`)}>
      {checked ? 'On' : 'Off'}
    </Switch.Root>
  </div>

  <p data-testid="state">
    checked: <strong data-testid="checked">{checked}</strong> · disabled:
    <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-set-true" type="button" onclick={() => (checked = true)}>
    Externally set checked=true
  </button>
  <button data-testid="ext-set-false" type="button" onclick={() => (checked = false)}>
    Externally set checked=false
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
