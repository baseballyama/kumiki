<!--
  @component Table.Body — `<tbody>`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<tbody data-component-part="body" {...rest}>{@render children()}</tbody>
