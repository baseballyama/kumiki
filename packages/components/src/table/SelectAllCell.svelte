<!--
  @component Table.SelectAllCell — tri-state select-all checkbox in the header.

  `selectAllState` is computed against rows that have registered with
  the Table (i.e. rendered Table.Row with `selectable`). 'mixed' renders
  the indeterminate visual via `data-state="indeterminate"`.

  Consumers who need explicit row ids can pass them via `rowIds` to
  override the registered set (e.g. for server-side bulk-select).
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { TABLE_CONTEXT_KEY, type TableContextValue } from './context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = {
    rowIds?: ReadonlyArray<string>;
    [key: string]: unknown;
  };

  let { rowIds, ...rest }: Props = $props();
  const ctx = getContext<TableContextValue>(TABLE_CONTEXT_KEY);
  const locale = tryUseLocale();

  const ariaLabel = $derived(locale?.messages.table.selectAll ?? 'Select all rows');

  function handleClick(): void {
    if (ctx.selectAllState === 'checked') {
      ctx.clearSelection();
      return;
    }
    if (rowIds) ctx.selectAllRows(rowIds);
  }

  // When rowIds aren't supplied we have no way to address all rows; the
  // button becomes a no-op for "select all" but still toggles "clear all".
  const disabled = $derived(!rowIds && ctx.selectAllState !== 'checked');
</script>

<th
  scope="col"
  data-part="select-all-cell"
  data-state={ctx.selectAllState === 'mixed'
    ? 'indeterminate'
    : ctx.selectAllState === 'checked'
      ? 'checked'
      : 'unchecked'}
  {...rest}
>
  <button
    type="button"
    data-part="select-all-button"
    role="checkbox"
    aria-checked={ctx.selectAllState === 'mixed'
      ? 'mixed'
      : ctx.selectAllState === 'checked'
        ? 'true'
        : 'false'}
    aria-label={ariaLabel}
    aria-disabled={disabled ? 'true' : undefined}
    {disabled}
    onclick={handleClick}
  ></button>
</th>
