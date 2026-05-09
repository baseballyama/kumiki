<script lang="ts">
  import { Row } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = {
    rowId: string;
    selectable?: boolean;
    expandable?: boolean;
    expanded?: boolean;
    onExpandedChange?: (v: boolean) => void;
    level?: number;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Row
  class={`border-b border-slate-200 transition-colors hover:bg-slate-50 data-[state=selected]:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 dark:data-[state=selected]:bg-slate-700 ${className}`.trim()}
  {...rest}
>
  {@render children()}
</Row>
