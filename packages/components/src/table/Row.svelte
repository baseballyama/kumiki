<!--
  @component Table.Row — `<tr>` with selection / expand / tree-level state.

  Sets `aria-selected`, `aria-expanded`, `aria-level` based on the
  per-row props. Registers itself with the Table.Root for select-all
  aggregation when `selectable`.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props = {
    rowId: string;
    selectable?: boolean;
    expandable?: boolean;
    expanded?: boolean;
    onExpandedChange?: (v: boolean) => void;
    /** 1-based; sets aria-level for tree rows. */
    level?: number;
    children: Snippet;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import { TABLE_CONTEXT_KEY, type TableContextValue } from './context.js';
  import { TABLE_ROW_CONTEXT_KEY, type TableRowContextValue } from './row-context.js';

  let {
    rowId,
    selectable = false,
    expandable = false,
    expanded = $bindable(false),
    onExpandedChange,
    level,
    children,
    ...rest
  }: Props = $props();

  const ctx = getContext<TableContextValue>(TABLE_CONTEXT_KEY);

  // Register / unregister with the parent Table whenever `selectable`
  // flips. Tracked in an effect so re-evaluation follows the prop.
  $effect(() => {
    if (!selectable) return undefined;
    ctx.registerRow(rowId);
    return () => ctx.unregisterRow(rowId);
  });

  const isSelected = $derived(selectable && ctx.selection.has(rowId));

  setContext<TableRowContextValue>(TABLE_ROW_CONTEXT_KEY, {
    get rowId() {
      return rowId;
    },
    get selectable() {
      return selectable;
    },
    get expandable() {
      return expandable;
    },
    get expanded() {
      return expanded;
    },
    get level() {
      return level;
    },
    toggleExpanded() {
      expanded = !expanded;
      onExpandedChange?.(expanded);
    },
  } as TableRowContextValue);
</script>

<tr
  {...rest}
  data-part="row"
  data-row-id={rowId}
  data-selected={isSelected ? '' : undefined}
  data-expandable={expandable ? '' : undefined}
  aria-selected={selectable ? (isSelected ? 'true' : 'false') : undefined}
  aria-expanded={expandable ? (expanded ? 'true' : 'false') : undefined}
  aria-level={level}
>
  {@render children()}
</tr>
