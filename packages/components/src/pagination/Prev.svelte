<!--
  @component Pagination.Prev — previous-page navigation control.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { PAGINATION_CONTEXT_KEY, type PaginationContextValue } from './context.js';
  import { tryUseLocale } from '../locale-provider/use-locale.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
  const ctx = getContext<PaginationContextValue>(PAGINATION_CONTEXT_KEY);
  const locale = tryUseLocale();

  const isDisabled = $derived(ctx.page <= 1);
  const ariaLabel = $derived(
    (rest['aria-label'] as string | undefined) ??
      locale?.messages.pagination.prev ??
      'Previous page',
  );
  const targetPage = $derived(Math.max(1, ctx.page - 1));

  function handleClick(event: MouseEvent): void {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    if (ctx.hrefFor) return;
    event.preventDefault();
    ctx.goto(targetPage);
  }
</script>

{#if ctx.hrefFor}
  <a
    {...rest}
    data-part="prev"
    href={isDisabled ? undefined : ctx.hrefFor(targetPage)}
    aria-label={ariaLabel}
    aria-disabled={isDisabled ? 'true' : undefined}
    data-disabled={isDisabled ? '' : undefined}
    onclick={handleClick}
  >
    {#if children}{@render children()}{/if}
  </a>
{:else}
  <button
    {...rest}
    type="button"
    data-part="prev"
    aria-label={ariaLabel}
    aria-disabled={isDisabled ? 'true' : undefined}
    data-disabled={isDisabled ? '' : undefined}
    disabled={isDisabled}
    onclick={handleClick}
  >
    {#if children}{@render children()}{/if}
  </button>
{/if}
