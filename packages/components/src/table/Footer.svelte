<!--
  @component Table.Footer — `<tfoot>`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<tfoot data-part="footer" {...rest}>{@render children()}</tfoot>
