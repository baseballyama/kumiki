<!--
  @component Table.SelectCell — row checkbox cell.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { TABLE_CONTEXT_KEY, type TableContextValue } from './context.js';
  import { TABLE_ROW_CONTEXT_KEY, type TableRowContextValue } from './row-context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = { [key: string]: unknown };
  let { ...rest }: Props = $props();

  const ctx = getContext<TableContextValue>(TABLE_CONTEXT_KEY);
  const row = getContext<TableRowContextValue>(TABLE_ROW_CONTEXT_KEY);
  const locale = tryUseLocale();

  const isChecked = $derived(ctx.selection.has(row.rowId));
  const ariaLabel = $derived(locale?.messages.table.rowSelect ?? 'Select row');

  function handleClick(): void {
    if (!row.selectable) return;
    ctx.toggleRow(row.rowId);
  }
</script>

<td data-part="select-cell" {...rest}>
  <button
    type="button"
    role="checkbox"
    data-part="select-button"
    aria-label={ariaLabel}
    aria-checked={isChecked ? 'true' : 'false'}
    data-state={isChecked ? 'checked' : 'unchecked'}
    onclick={handleClick}
  ></button>
</td>
