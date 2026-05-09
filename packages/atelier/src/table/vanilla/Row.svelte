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

<Row class={className} {...rest}>{@render children()}</Row>
