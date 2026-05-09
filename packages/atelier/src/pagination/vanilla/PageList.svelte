<script lang="ts">
  import { PageList } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type ItemPayload = {
    page: number;
    isCurrent: boolean;
    isEllipsis: boolean;
    ellipsisSide: 'start' | 'end' | undefined;
  };

  type Props = { item: Snippet<[ItemPayload]>; class?: string; [k: string]: unknown };
  let { item, class: className = '', ...rest }: Props = $props();
</script>

<PageList {item} class={className} {...rest} />
