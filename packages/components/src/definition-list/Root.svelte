<!--
  @component DefinitionList.Root — semantic <dl> wrapper.

  When `grouped`, individual `<dt>+<dd>` pairs may be wrapped in a `<div>`
  (HTML 5.2+ allows this, useful for CSS Grid layouts). The wrapper
  responsibility lives at the consumer site; Root just renders the `<dl>`.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props = {
    grouped?: boolean;
    children: Snippet;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  let { grouped = false, children, ...rest }: Props = $props();
</script>

<dl {...rest} data-grouped={grouped ? '' : undefined}>{@render children()}</dl>
