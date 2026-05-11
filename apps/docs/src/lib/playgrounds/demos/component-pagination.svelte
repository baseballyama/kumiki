<script lang="ts">
  import { Pagination } from '@kumiki/components/pagination';

  let page = $state(1);
  let pageCount = $state(20);
</script>

<div class="demo">
  <div class="controls">
    <label class="control">
      pageCount
      <input type="number" min="1" max="999" bind:value={pageCount} />
    </label>
    <label class="control">
      page
      <input type="number" min="1" max={pageCount} bind:value={page} />
    </label>
  </div>

  <Pagination.Root {page} {pageCount} onPageChange={(p) => (page = p)}>
    <Pagination.Prev>‹ Prev</Pagination.Prev>
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
    <Pagination.Next>Next ›</Pagination.Next>
  </Pagination.Root>

  <p class="state">
    page = <code>{page}</code> · pageCount = <code>{pageCount}</code>
  </p>
</div>

<style>
  .demo {
    background: var(--k-surface-0);
    border: 1px solid var(--k-line-1);
    border-radius: var(--k-radius-md);
    padding: 24px;
    width: 460px;
    min-height: 240px;
    box-sizing: border-box;
  }
  .controls {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  .control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--k-ink-3);
    font-size: 13px;
  }
  .control input {
    background: var(--k-code-bg);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: 6px;
    padding: 4px 8px;
    width: 70px;
  }
  .demo :global(nav[data-component-part='root']) {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .demo :global(ul[data-component-part='page-list']) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .demo :global(button[data-component-part='prev']),
  .demo :global(button[data-component-part='next']),
  .demo :global(button[data-component-part='page-item']) {
    background: var(--k-surface-2);
    color: var(--k-ink-1);
    border: 1px solid var(--k-line-2);
    border-radius: var(--k-radius-sm);
    padding: 6px 10px;
    cursor: pointer;
    font: inherit;
    min-width: 32px;
  }
  .demo :global(button[aria-current='page']) {
    background: var(--k-shu);
    border-color: var(--k-shu);
    color: white;
  }
  .demo :global(button[aria-disabled='true']) {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .demo :global([data-component-part='ellipsis']) {
    color: var(--k-ink-3);
    padding: 0 6px;
  }
  .state {
    color: var(--k-ink-3);
    font-size: 13px;
    margin-top: 16px;
    font-family: var(--k-font-mono, monospace);
  }
  .state code {
    color: var(--k-matcha-ink);
  }
</style>
