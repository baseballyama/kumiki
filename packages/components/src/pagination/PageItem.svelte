<!--
  @component Pagination.PageItem — single page navigation control.

  Renders `<button>` (default) or `<a href>` when Root is configured
  with `asLinks`. Sets `aria-current="page"` when the page is current
  and supplies a localised `aria-label`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { PAGINATION_CONTEXT_KEY, type PaginationContextValue } from './context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = {
    page: number;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { page, children, ...rest }: Props = $props();
  const ctx = getContext<PaginationContextValue>(PAGINATION_CONTEXT_KEY);
  const locale = tryUseLocale();

  const isCurrent = $derived(page === ctx.page);
  const ariaLabel = $derived(
    isCurrent
      ? (locale?.messages.pagination.currentPage(page) ?? `Page ${page}, current`)
      : (locale?.messages.pagination.page(page) ?? `Page ${page}`),
  );

  function handleClick(event: MouseEvent): void {
    if (ctx.hrefFor) return;
    event.preventDefault();
    ctx.goto(page);
  }
</script>

{#if ctx.hrefFor}
  <a
    {...rest}
    data-part="page-item"
    href={ctx.hrefFor(page)}
    aria-label={ariaLabel}
    aria-current={isCurrent ? 'page' : undefined}
    data-current={isCurrent ? 'page' : undefined}
  >
    {#if children}{@render children()}{:else}{page}{/if}
  </a>
{:else}
  <button
    {...rest}
    type="button"
    data-part="page-item"
    aria-label={ariaLabel}
    aria-current={isCurrent ? 'page' : undefined}
    data-current={isCurrent ? 'page' : undefined}
    onclick={handleClick}
  >
    {#if children}{@render children()}{:else}{page}{/if}
  </button>
{/if}
