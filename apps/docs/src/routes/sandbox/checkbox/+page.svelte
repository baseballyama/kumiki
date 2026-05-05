<script lang="ts">
  import { Checkbox, type CheckboxValue } from '@kumiki/components/checkbox';
  import { page } from '$app/state';

  const initial = $derived<CheckboxValue>(
    page.url.searchParams.get('initial') === 'checked'
      ? 'checked'
      : page.url.searchParams.get('initial') === 'mixed'
        ? 'mixed'
        : 'unchecked',
  );
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // svelte-ignore state_referenced_locally
  let value = $state<CheckboxValue>(initial);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Checkbox sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="checkbox" data-testid="sandbox">
  <h1>Checkbox sandbox</h1>

  <div data-testid="checkbox-host">
    <Checkbox.Root bind:value {disabled} onCheckedChange={(v) => append(`onCheckedChange(${v})`)}>
      {value === 'checked' ? '☑' : value === 'mixed' ? '⊟' : '☐'}
    </Checkbox.Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value}</strong> · disabled:
    <strong data-testid="disabled">{disabled}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-set-checked" type="button" onclick={() => (value = 'checked')}>
    Externally set checked
  </button>
  <button data-testid="ext-set-mixed" type="button" onclick={() => (value = 'mixed')}>
    Externally set mixed
  </button>
  <button data-testid="ext-set-unchecked" type="button" onclick={() => (value = 'unchecked')}>
    Externally set unchecked
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
