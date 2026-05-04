<script lang="ts">
  import {
    Root,
    Input,
    Listbox,
    Item,
    Trigger,
    type ComboboxOption,
  } from '@kumiki/component-combobox';
  import { page } from '$app/state';

  interface User extends ComboboxOption {
    id: string;
    label: string;
  }

  const users: User[] = [
    { id: '1', label: 'Alice' },
    { id: '2', label: 'Bob' },
    { id: '3', label: 'Carol' },
    { id: '4', label: 'Dan' },
    { id: '5', label: 'Eve' },
  ];

  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');
  const disabled = $derived(page.url.searchParams.get('disabled') === '1');

  let value = $state<User | null>(null);
  let log = $state<string[]>([]);

  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Combobox sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component-host="combobox" data-testid="sandbox">
  <h1>Combobox sandbox</h1>

  <div data-testid="combobox-host">
    <Root
      options={users}
      bind:value
      {disabled}
      onValueChange={(v: User | null) => append(`onValueChange(${v?.label ?? 'null'})`)}
    >
      <label for="cb-input">User</label>
      <div class="combobox-row">
        <Input id="cb-input" placeholder="Search a user…" data-testid="cb-input" />
        <Trigger aria-label="Toggle options" data-testid="cb-trigger">▾</Trigger>
      </div>
      <Listbox>
        {#snippet item(user: User)}
          <Item value={user}>{user.label}</Item>
        {/snippet}
        {#snippet empty()}
          <li class="empty">No matches.</li>
        {/snippet}
      </Listbox>
    </Root>
  </div>

  <p data-testid="state">
    value: <strong data-testid="value">{value?.label ?? 'null'}</strong> · dir:
    <strong data-testid="dir">{dir}</strong>
  </p>

  <button type="button" data-testid="ext-clear" onclick={() => (value = null)}>
    Clear externally
  </button>
  <button type="button" data-testid="ext-set-bob" onclick={() => (value = users[1]!)}>
    Set to Bob externally
  </button>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}
      <li>{line}</li>
    {/each}
  </ol>
</div>

<style>
  .combobox-row {
    display: flex;
    gap: 4px;
    align-items: center;
    margin-top: 4px;
  }
  .empty {
    padding: 8px 12px;
    color: #888;
    font-style: italic;
  }
</style>
