<!--
  Table sandbox — Playwright + axe fixture.

  Query params:
    ?selection=none|single|multiple
    ?dir=rtl
-->
<script lang="ts">
  import { Table, type SortState, type SelectionMode } from '@kumiki/components/table';
  import { page } from '$app/state';

  const selectionMode = $derived(
    (page.url.searchParams.get('selection') ?? 'none') as SelectionMode,
  );
  const dir = $derived(page.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  const rows = [
    { id: 'r1', name: 'Mei', role: 'Admin' },
    { id: 'r2', name: 'Yui', role: 'Editor' },
    { id: 'r3', name: 'Ryo', role: 'Viewer' },
  ];

  let sort = $state<SortState | null>(null);
  let selection = $state<Set<string>>(new Set<string>());
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Table sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="table" data-testid="sandbox">
  <h1>Table sandbox</h1>

  <div data-testid="table-host">
    <Table.Root
      bind:selection
      {sort}
      {selectionMode}
      onSortChange={(s) => {
        sort = s;
        append(`onSortChange(${JSON.stringify(s)})`);
      }}
      onSelectionChange={(s) => append(`onSelectionChange(${[...s].join(',')})`)}
      aria-label="People"
    >
      <Table.Caption>People</Table.Caption>
      <Table.Header>
        <Table.HeaderRow>
          {#if selectionMode === 'multiple'}
            <Table.SelectAllCell rowIds={rows.map((r) => r.id)} />
          {/if}
          <Table.HeaderCell column="name" sortable>Name</Table.HeaderCell>
          <Table.HeaderCell column="role">Role</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {#each rows as r (r.id)}
          <Table.Row rowId={r.id} selectable={selectionMode !== 'none'}>
            {#if selectionMode !== 'none'}
              <Table.SelectCell />
            {/if}
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell>{r.role}</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <p data-testid="state">
    selection-mode: <strong data-testid="selection-mode">{selectionMode}</strong>
    · sort: <strong data-testid="sort">{sort ? `${sort.column}:${sort.direction}` : 'none'}</strong>
    · selected: <strong data-testid="selected">{[...selection].join(',') || 'none'}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
