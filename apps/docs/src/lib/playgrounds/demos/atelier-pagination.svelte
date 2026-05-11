<script lang="ts">
  import { Vanilla as Pagination } from '@kumiki/atelier/pagination';

  let page = $state(3);
  const pageCount = 18;
</script>

<div class="demo">
  <Pagination.Root {page} {pageCount} onPageChange={(p) => (page = p)}>
    <Pagination.Prev>‹</Pagination.Prev>
    <Pagination.PageList>
      {#snippet item({ page: n, isCurrent, isEllipsis })}
        {#if isEllipsis}
          <Pagination.Ellipsis />
        {:else}
          <Pagination.PageItem page={n} data-current={isCurrent ? '' : undefined}>
            {n}
          </Pagination.PageItem>
        {/if}
      {/snippet}
    </Pagination.PageList>
    <Pagination.Next>›</Pagination.Next>
  </Pagination.Root>

  <p class="state">page = <code>{page}</code> / {pageCount}</p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
  }
  .state {
    margin-top: 16px;
    color: var(--k-ink-3);
    font-size: 13px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
