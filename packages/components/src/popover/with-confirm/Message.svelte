<!--
  @component Popconfirm.Message — paragraph wired as the alertdialog's
  accessible description.

  Re-uses `Popover.Description`'s controller hook so the surrounding panel's
  `aria-describedby` lands on this node automatically.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { POPOVER_CONTEXT_KEY, type PopoverContextValue } from '../context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<PopoverContextValue>(POPOVER_CONTEXT_KEY);
</script>

<p {...rest} {@attach controller.description}>
  {#if children}{@render children()}{/if}
</p>
