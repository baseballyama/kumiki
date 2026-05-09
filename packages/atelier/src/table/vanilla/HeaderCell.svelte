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

<HeaderCell class={className} {...rest}>{@render children()}</HeaderCell>
