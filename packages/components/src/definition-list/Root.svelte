<!--
  @component DefinitionList.Root — semantic <dl> wrapper.

  Rendering choices (CSS Grid, two-column layouts, `<div>` group wrappers
  per HTML 5.2+) live in atelier or your own stylesheet — pass `class` or
  `data-*` through the rest-spread to drive them.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte';
  export type Props = {
    children: Snippet;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  let { children, ...rest }: Props = $props();
</script>

<dl {...rest}>{@render children()}</dl>
