<script lang="ts">
  import { Root, Item, type RadioItem } from '@kumiki/component-radio-group';
  import { page } from '$app/state';

  const items: RadioItem<string>[] = [
    { id: 'a', value: 'apple', label: 'Apple' },
    { id: 'b', value: 'banana', label: 'Banana', disabled: true },
    { id: 'c', value: 'cherry', label: 'Cherry' },
    { id: 'd', value: 'date', label: 'Date' },
  ];

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');
  const initial = $derived(page.url.searchParams.get('initial') ?? null);

  // svelte-ignore state_referenced_locally
  let value = $state<string | null>(initial);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>RadioGroup sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component-host="radio-group" data-testid="sandbox">
  <h1>RadioGroup sandbox</h1>

  <div data-testid="rg-host">
    <Root
      {items}
      bind:value
      {disabled}
      onValueChange={(v: string | null) => append(`onValueChange(${v ?? 'null'})`)}
    >
      {#each items as item (item.id)}
        <Item value={item}>{item.label}</Item>
      {/each}
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value ?? 'null'}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-clear" type="button" onclick={() => (value = null)}>Clear</button>
  <button data-testid="ext-set-cherry" type="button" onclick={() => (value = 'cherry')}>
    Set cherry externally
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>
