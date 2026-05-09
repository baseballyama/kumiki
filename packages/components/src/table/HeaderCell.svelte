<!--
  @component Table.HeaderCell — `<th scope="col">` with optional sort button.

  When `sortable`, renders a button that cycles
  ascending → descending → none. Sets `aria-sort` on the cell to mirror
  the active direction.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { TABLE_CONTEXT_KEY, type TableContextValue } from './context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = {
    column?: string;
    sortable?: boolean;
    children: Snippet;
    [key: string]: unknown;
  };

  let { column, sortable = false, children, ...rest }: Props = $props();
  const ctx = getContext<TableContextValue>(TABLE_CONTEXT_KEY);
  const locale = tryUseLocale();

  const isActiveSortColumn = $derived(
    sortable && column !== undefined && ctx.sort?.column === column,
  );
  const ariaSort = $derived(
    isActiveSortColumn ? ctx.sort?.direction : sortable ? 'none' : undefined,
  );

  const sortLabel = $derived.by(() => {
    if (!sortable) return undefined;
    const active = ctx.sort && ctx.sort.column === column ? ctx.sort : null;
    if (active?.direction === 'ascending') {
      return locale?.messages.table.sortDescending ?? 'Sort descending';
    }
    if (active?.direction === 'descending') {
      return locale?.messages.table.sortClear ?? 'Clear sort';
    }
    return locale?.messages.table.sortAscending ?? 'Sort ascending';
  });

  function handleClick(): void {
    if (!sortable || column === undefined) return;
    ctx.cycleSort(column);
  }
</script>

<th
  {...rest}
  scope="col"
  data-part="header-cell"
  data-sortable={sortable ? '' : undefined}
  aria-sort={ariaSort}
>
  {#if sortable}
    <button type="button" data-part="sort-button" aria-label={sortLabel} onclick={handleClick}>
      {@render children()}
    </button>
  {:else}
    {@render children()}
  {/if}
</th>
