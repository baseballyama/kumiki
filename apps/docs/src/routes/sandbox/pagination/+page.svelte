<!--
  Pagination sandbox — Playwright + axe fixture.

  Query params:
    ?page=N          start at page N (default 1)
    ?total=N         pageCount (default 8)
    ?dir=rtl
-->
<script lang="ts">
  import { Pagination } from '@kumiki/components/pagination';
  import { page as pageStore } from '$app/state';

  const initialPage = $derived(Number(pageStore.url.searchParams.get('page') ?? '1'));
  const total = $derived(Number(pageStore.url.searchParams.get('total') ?? '8'));
  const dir = $derived(pageStore.url.searchParams.get('dir') === 'rtl' ? 'rtl' : 'ltr');

  // svelte-ignore state_referenced_locally
  let current = $state(initialPage);
  let log = $state<string[]>([]);
  function append(line: string) {
    log = [...log, `${log.length + 1}. ${line}`];
  }
</script>

<svelte:head>
  <title>Pagination sandbox · Kumiki</title>
</svelte:head>

<div {dir} data-component="pagination" data-testid="sandbox">
  <h1>Pagination sandbox</h1>

  <div data-testid="pagination-host">
    <Pagination.Root
      page={current}
      pageCount={total}
      onPageChange={(p) => {
        current = p;
        append(`onPageChange(${p})`);
      }}
    >
      <Pagination.Prev data-testid="prev">Prev</Pagination.Prev>
      <Pagination.PageList>
        {#snippet item({ page, isCurrent, isEllipsis })}
          {#if isEllipsis}
            <Pagination.Ellipsis />
          {:else}
            <Pagination.PageItem {page} data-page={page} data-current={isCurrent ? '' : undefined}>
              {page}
            </Pagination.PageItem>
          {/if}
        {/snippet}
      </Pagination.PageList>
      <Pagination.Next data-testid="next">Next</Pagination.Next>
    </Pagination.Root>
  </div>

  <p data-testid="state">
    page: <strong data-testid="page">{current}</strong>
    · total: <strong data-testid="total">{total}</strong>
    · dir: <strong data-testid="dir">{dir}</strong>
  </p>

  <h2>Event log</h2>
  <ol data-testid="log">
    {#each log as line, i (i)}<li>{line}</li>{/each}
  </ol>
</div>
