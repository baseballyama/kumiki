<!--
  @component Table.ExpandCell — disclosure toggle for tree rows.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import { TABLE_ROW_CONTEXT_KEY, type TableRowContextValue } from './row-context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = { [key: string]: unknown };
  let { ...rest }: Props = $props();

  const row = getContext<TableRowContextValue>(TABLE_ROW_CONTEXT_KEY);
  const locale = tryUseLocale();

  const ariaLabel = $derived(
    row.expanded
      ? (locale?.messages.table.rowCollapse ?? 'Collapse row')
      : (locale?.messages.table.rowExpand ?? 'Expand row'),
  );

  function handleClick(): void {
    row.toggleExpanded();
  }
</script>

<td data-part="expand-cell" {...rest}>
  <button
    type="button"
    data-part="expand-button"
    aria-label={ariaLabel}
    aria-expanded={row.expanded ? 'true' : 'false'}
    onclick={handleClick}
  ></button>
</td>
