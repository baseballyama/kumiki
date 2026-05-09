<!--
  @component Pagination.PageList — renders the computed page items.

  Receives an `item` snippet that the consumer uses to render each page
  / ellipsis. The component supplies the payload `{ page, isCurrent,
  isEllipsis, ellipsisSide }` so consumers can branch.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { PAGINATION_CONTEXT_KEY, type PaginationContextValue } from './context.js';

  type ItemPayload = {
    page: number;
    isCurrent: boolean;
    isEllipsis: boolean;
    ellipsisSide: 'start' | 'end' | undefined;
  };

  type Props = {
    item: Snippet<[ItemPayload]>;
    [key: string]: unknown;
  };

  let { item, ...rest }: Props = $props();
  const ctx = getContext<PaginationContextValue>(PAGINATION_CONTEXT_KEY);
</script>

<ul role="list" data-part="page-list" {...rest}>
  {#each ctx.items as it, i (i)}
    <li role="listitem" data-part="page-list-item">
      {#if it.type === 'ellipsis'}
        {@render item({
          page: 0,
          isCurrent: false,
          isEllipsis: true,
          ellipsisSide: it.side,
        })}
      {:else}
        {@render item({
          page: it.page,
          isCurrent: it.isCurrent,
          isEllipsis: false,
          ellipsisSide: undefined,
        })}
      {/if}
    </li>
  {/each}
</ul>
