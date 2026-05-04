<!--
  NumberField sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=N            default value (number); ?initial=null clears
    ?min=N&max=N&step=N   bounds and step
    ?disabled=1           start disabled
    ?dir=rtl              wrap in dir="rtl"
-->
<script lang="ts">
  import { Root, Input, Increment, Decrement } from '@kumiki/component-number-field';
  import { page } from '$app/state';

  function parseNum(raw: string | null, fallback: number): number {
    if (raw === null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const min = $derived(parseNum(page.url.searchParams.get('min'), 0));
  const max = $derived(parseNum(page.url.searchParams.get('max'), 10));
  const step = $derived(parseNum(page.url.searchParams.get('step'), 1));
  const initialRaw = $derived(page.url.searchParams.get('initial'));
  const initial = $derived(initialRaw === 'null' ? null : parseNum(initialRaw, 5));

  // svelte-ignore state_referenced_locally
  let value = $state<number | null>(initial);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>NumberField sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>NumberField sandbox</h1>

  <div data-testid="number-field-host">
    <Root
      bind:value
      {min}
      {max}
      {step}
      {disabled}
      onValueChange={(v) => append(`onValueChange(${v === null ? 'null' : v})`)}
    >
      <Decrement data-testid="decrement" aria-label="Decrease quantity">−</Decrement>
      <Input data-testid="input" aria-label="Quantity" />
      <Increment data-testid="increment" aria-label="Increase quantity">+</Increment>
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value === null ? 'null' : value}</strong>
    · min: <strong data-testid="min">{min}</strong>
    · max: <strong data-testid="max">{max}</strong>
    · step: <strong data-testid="step">{step}</strong>
    · disabled: <strong data-testid="disabled">{disabled}</strong>
  </p>

  <button data-testid="ext-zero" type="button" onclick={() => (value = 0)}>Set 0</button>
  <button data-testid="ext-clear" type="button" onclick={() => (value = null)}>Clear</button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global([data-component-host='number-field']) {
    display: inline-flex;
    align-items: stretch;
    gap: 0;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    overflow: hidden;
    background: #1a1a30;
    margin: 12px 0;
  }
  :global([data-component-host='number-field'] [data-component-part='input']) {
    width: 96px;
    background: #0e0e1c;
    color: #e0e0e0;
    border: none;
    text-align: center;
    font-variant-numeric: tabular-nums;
    padding: 6px 8px;
    font-size: 14px;
  }
  :global([data-component-host='number-field'] [data-component-part='input']:focus) {
    outline: 2px solid #4fc08d;
    outline-offset: -2px;
  }
  :global([data-component-host='number-field'] button) {
    width: 32px;
    background: #1a1a30;
    color: #e0e0e0;
    border: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
  }
  :global([data-component-host='number-field'] button:hover:not(:disabled)) {
    background: #2a2a4a;
  }
  :global([data-component-host='number-field'] button:disabled) {
    opacity: 0.4;
    cursor: not-allowed;
  }
  :global([data-component-host='number-field'][data-disabled]) {
    opacity: 0.6;
  }
  :global([data-component-host='number-field'][data-disabled] [data-component-part='input']) {
    cursor: not-allowed;
  }
</style>
