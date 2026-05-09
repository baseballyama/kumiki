<!--
  @component Table.Caption — `<caption>` for the table.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<caption data-part="caption" {...rest}>{@render children()}</caption>
