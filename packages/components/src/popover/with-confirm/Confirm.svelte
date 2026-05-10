<!--
  @component Popconfirm.Confirm — primary action button.

  Calls the `onConfirm` callback supplied to `Popconfirm.Root`, then closes
  the popover. The callback may return a promise — the popover stays open
  until it resolves so consumers can show loading state inside.

  Snippets:
  - `children` — visible label. Defaults to the locale's `popconfirm.confirm`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { POPCONFIRM_CONTEXT_KEY, type PopconfirmContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const ctxOptional = getContext<PopconfirmContextValue | undefined>(POPCONFIRM_CONTEXT_KEY);
  if (!ctxOptional) {
    throw new Error('<Popconfirm.Confirm> must be inside <Popconfirm.Root>.');
  }
  const ctx: PopconfirmContextValue = ctxOptional;

  async function handleClick(): Promise<void> {
    await ctx.fireConfirm();
  }
</script>

<button {...rest} type="button" data-component-part="confirm" onclick={handleClick}>
  {#if children}{@render children()}{:else}{ctx.confirmLabel}{/if}
</button>
