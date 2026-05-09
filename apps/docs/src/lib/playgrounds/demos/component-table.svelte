<script lang="ts">
  import { Table, type SortState } from '@kumiki/components/table';

  type Row = { id: string; name: string; role: string; commits: number };

  const data: Row[] = [
    { id: '1', name: 'Aiko Tanaka', role: 'Maintainer', commits: 412 },
    { id: '2', name: 'Beni Sato', role: 'Contributor', commits: 87 },
    { id: '3', name: 'Cho Yamamoto', role: 'Maintainer', commits: 233 },
    { id: '4', name: 'Daichi Kobayashi', role: 'Contributor', commits: 12 },
  ];

  let sort = $state<SortState | null>({ column: 'commits', direction: 'descending' });
  let selection = $state(new Set<string>());

  const rows = $derived.by(() => {
    if (!sort) return data;
    const dir = sort.direction === 'ascending' ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = a[sort!.column as keyof Row];
      const bv = b[sort!.column as keyof Row];
      if (av === bv) return 0;
      return av < bv ? -1 * dir : 1 * dir;
    });
  });
</script>

<div class="demo">
  <Table.Root
    {sort}
    onSortChange={(s) => (sort = s)}
    {selection}
    onSelectionChange={(s) => (selection = s)}
    selectionMode="multiple"
  >
    <Table.Caption>Project contributors (sortable, selectable)</Table.Caption>
    <Table.Header>
      <Table.HeaderRow>
        <Table.SelectAllCell />
        <Table.HeaderCell column="name" sortable>Name</Table.HeaderCell>
        <Table.HeaderCell column="role" sortable>Role</Table.HeaderCell>
        <Table.HeaderCell column="commits" sortable>Commits</Table.HeaderCell>
      </Table.HeaderRow>
    </Table.Header>
    <Table.Body>
      {#each rows as row (row.id)}
        <Table.Row rowId={row.id} selectable>
          <Table.SelectCell />
          <Table.Cell>{row.name}</Table.Cell>
          <Table.Cell>{row.role}</Table.Cell>
          <Table.Cell>{row.commits}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>

  <p class="state">
    sort = <code>{JSON.stringify(sort)}</code> · selected =
    <code>[{[...selection].join(', ')}]</code>
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .demo :global(table) {
    width: 100%;
    border-collapse: collapse;
    color: var(--k-ink-1);
    font-size: 14px;
  }
  .demo :global(caption) {
    text-align: start;
    color: var(--k-ink-3);
    font-size: 12px;
    padding-bottom: 8px;
  }
  .demo :global(th),
  .demo :global(td) {
    padding: 8px 12px;
    border-bottom: 1px solid var(--k-line-1);
    text-align: start;
  }
  .demo :global(th) {
    color: var(--k-ink-3);
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    background: var(--k-surface-1);
  }
  .demo :global(button[data-part='sort-button']) {
    background: transparent;
    color: inherit;
    border: 0;
    cursor: pointer;
    padding: 0;
    font: inherit;
    text-transform: inherit;
  }
  .demo :global(th[aria-sort='ascending'] button[data-part='sort-button']::after) {
    content: ' ▲';
    color: var(--k-shu);
  }
  .demo :global(th[aria-sort='descending'] button[data-part='sort-button']::after) {
    content: ' ▼';
    color: var(--k-shu);
  }
  .demo :global(tr[data-selected]) {
    background: rgba(229, 88, 22, 0.06);
  }
  .state {
    margin-top: 12px;
    color: var(--k-ink-3);
    font-size: 12px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha);
  }
</style>
