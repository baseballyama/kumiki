<!--
  @component Popconfirm.Cancel — non-destructive action button.

  Calls the optional `onCancel` callback then closes the popover. Registers
  itself with the recipe context so `Popconfirm.Content` can move initial
  focus here on open (per APG `alertdialog` guidance: initial focus on the
  least-destructive action).
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
    throw new Error('<Popconfirm.Cancel> must be inside <Popconfirm.Root>.');
  }
  const ctx: PopconfirmContextValue = ctxOptional;

  function register(node: HTMLButtonElement): () => void {
    return ctx.registerCancel(node);
  }

  function handleClick(): void {
    ctx.fireCancel();
  }
</script>

<button
  {...rest}
  type="button"
  data-component-part="cancel"
  onclick={handleClick}
  {@attach register}
>
  {#if children}{@render children()}{:else}{ctx.cancelLabel}{/if}
</button>
