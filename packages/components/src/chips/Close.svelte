<!--
  @component Chips.Close — dismiss button on a `dismissible` chip.

  Auto-supplies `aria-label="Remove {label}"` from the parent Root's
  `label` prop. Override by passing `aria-label`.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { CHIPS_CONTEXT_KEY, type ChipsContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
  const ctx = getContext<ChipsContextValue>(CHIPS_CONTEXT_KEY);

  const ariaLabel = $derived(
    (rest['aria-label'] as string | undefined) ??
      (ctx.label !== undefined ? `Remove ${ctx.label}` : 'Remove'),
  );

  function handleClick(): void {
    ctx.onDismiss();
  }
</script>

<button
  {...rest}
  type="button"
  data-component-part="close"
  aria-label={ariaLabel}
  onclick={handleClick}
>
  {#if children}{@render children()}{/if}
</button>
