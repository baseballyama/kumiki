<!--
  Select sandbox — fixture for Playwright + axe.

  Query params:
    ?initial=cherry             defaultValue
    ?open=1                     start open
    ?navigation=clamp           clamp instead of wrap
    ?dir=rtl                    wrap in dir="rtl"
-->
<script lang="ts">
  import { Root, Trigger, Listbox, Option, type SelectItem } from '@kumiki/components/select';
  import { page } from '$app/state';

  const items: SelectItem<string>[] = [
    { id: 's-a', value: 'apple', label: 'Apple' },
    { id: 's-b', value: 'banana', label: 'Banana', disabled: true },
    { id: 's-c', value: 'cherry', label: 'Cherry' },
    { id: 's-d', value: 'date', label: 'Date' },
  ];

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const navigation = $derived(
    page.url.searchParams.get('navigation') === 'clamp' ? 'clamp' : 'wrap',
  );
  const initial = $derived(page.url.searchParams.get('initial'));
  const startOpen = $derived(page.url.searchParams.get('open') === '1');

  // svelte-ignore state_referenced_locally
  let value = $state<string | null>(initial ?? null);
  let open = $state<boolean>(false);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }

  const labelFor = (v: string | null) => items.find((it) => it.value === v)?.label ?? null;
</script>

<svelte:head>
  <title>Select sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-testid="sandbox">
  <h1>Select sandbox</h1>

  <div data-testid="select-host">
    <Root
      {items}
      bind:value
      defaultOpen={startOpen}
      {navigation}
      onValueChange={(v) => append(`onValueChange(${v ?? 'null'})`)}
      onOpenChange={(v) => (open = v)}
    >
      <Trigger data-testid="trigger" class="trigger">
        {labelFor(value) ?? 'Pick a fruit'}
      </Trigger>
      <Listbox data-testid="listbox" class="listbox">
        {#each items as item (item.id)}
          <Option value={item} data-testid={`opt-${item.value}`}>{item.label}</Option>
        {/each}
      </Listbox>
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value ?? 'null'}</strong>
    · open: <strong data-testid="open">{open}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <button data-testid="ext-clear" type="button" onclick={() => (value = null)}>Clear</button>
  <button data-testid="ext-set-cherry" type="button" onclick={() => (value = 'cherry')}>
    Set cherry
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  :global(.trigger) {
    background: #1e1e3a;
    color: #e0e0e0;
    border: 1px solid #3a3a5a;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
  }
  :global(.listbox[hidden]) {
    display: none;
  }
  :global(.listbox:not([hidden])) {
    margin: 4px 0 0;
    padding: 4px 0;
    list-style: none;
    background: #fff;
    color: #111;
    border: 1px solid #3a3a5a;
    border-radius: 6px;
    min-width: 160px;
  }
  :global(.listbox [role='option']) {
    padding: 6px 12px;
    cursor: pointer;
  }
  :global(.listbox [role='option'][data-highlighted]) {
    background: #ff3e00;
    color: #fff;
  }
  :global(.listbox [role='option'][aria-selected='true']) {
    font-weight: bold;
  }
  :global(.listbox [role='option'][aria-disabled='true']) {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
