<script lang="ts">
  import { Root } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';
  import type { SortState, SelectionMode } from '@kumiki/components/table';

  type Props = {
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

  let {
    selection = $bindable(new Set<string>()),
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root
  bind:selection
  class={`w-full caption-bottom border-collapse text-sm ${className}`.trim()}
  {...rest}
>
  {@render children()}
</Root>
