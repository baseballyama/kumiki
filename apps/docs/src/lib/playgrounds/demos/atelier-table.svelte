<script lang="ts">
  import { Vanilla as Table } from '@kumiki/atelier/table';
  import type { SortState } from '@kumiki/components/table';

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
    <Table.Caption>Project contributors</Table.Caption>
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
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 480px;
    min-height: 360px;
    box-sizing: border-box;
  }
</style>
