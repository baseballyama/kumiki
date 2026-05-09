<!--
  @component Popconfirm.Trigger — re-export of `Popover.Trigger`.

  Provided as a named export so consumers can write `<Popconfirm.Trigger>`
  consistently inside the `<Popconfirm.Root>` tree without grabbing
  `<Popover.Trigger>` from a sibling subpath.
-->
<script lang="ts">
  import PopoverTrigger from '../Trigger.svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
</script>

<PopoverTrigger {...rest}>
  {#if children}{@render children()}{/if}
</PopoverTrigger>
