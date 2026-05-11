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

<svelte:element
  this={ctx.hrefFor ? 'a' : 'button'}
  {...rest}
  data-component-part="page-item"
  href={ctx.hrefFor?.(page)}
  type={ctx.hrefFor ? undefined : 'button'}
  aria-label={ariaLabel}
  aria-current={isCurrent ? 'page' : undefined}
  data-current={isCurrent ? 'page' : undefined}
  onclick={ctx.hrefFor ? undefined : handleClick}
>
  {#if children}{@render children()}{:else}{page}{/if}
</svelte:element>
