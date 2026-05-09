<!--
  @component AvatarGroup.Overflow — "+N more" indicator.

  Computes N from the parent group's `total` and visible-`max` count.
  The default label uses the consumer-supplied `count` prop directly
  if neither is reliable.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { AVATAR_GROUP_CONTEXT_KEY, type AvatarGroupContextValue } from './context.js';

  type Props = {
    /** Override the computed count. */
    count?: number;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { count, children, ...rest }: Props = $props();
  const ctx = getContext<AvatarGroupContextValue>(AVATAR_GROUP_CONTEXT_KEY);

  const computed = $derived(
    count ?? (ctx.total != null && ctx.max != null ? Math.max(0, ctx.total - ctx.max) : 0),
  );

  const ariaLabel = $derived(`+${computed} more`);
</script>

<li role="listitem" data-part="overflow" {...rest} aria-label={ariaLabel}>
  {#if children}{@render children()}{:else}+{computed}{/if}
</li>
