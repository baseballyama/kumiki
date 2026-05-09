<script lang="ts">
  import { HeaderCell } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = {
    column?: string;
    sortable?: boolean;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<HeaderCell
  class={`h-10 px-3 text-left align-middle font-medium text-slate-700 dark:text-slate-200 ${className}`.trim()}
  {...rest}
>
  {@render children()}
</HeaderCell>
