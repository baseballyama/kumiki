<!--
  @component Table.HeaderRow — `<tr>` inside Header.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<tr data-part="header-row" {...rest}>{@render children()}</tr>
