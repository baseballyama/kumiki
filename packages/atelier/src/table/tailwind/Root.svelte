<script lang="ts">
  import { Root } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';
  import type { SortState, SelectionMode } from '@kumiki/components/table';

  type BaseProps = {
    sort?: SortState | null;
    onSortChange?: (sort: SortState | null) => void;
    selection?: Set<string>;
    onSelectionChange?: (selection: Set<string>) => void;
    selectionMode?: SelectionMode;
    stickyHeader?: boolean;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  type Props = (BaseProps & { 'aria-label': string }) | (BaseProps & { 'aria-labelledby': string });

  let {
    selection = $bindable(new Set<string>()),
    stickyHeader = false,
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root
  bind:selection
  class={`w-full caption-bottom border-collapse text-sm ${className}`.trim()}
  data-sticky={stickyHeader ? 'header' : undefined}
  {...rest}
>
  {@render children()}
</Root>
