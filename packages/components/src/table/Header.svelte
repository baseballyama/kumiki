<!--
  @component Table.Header — `<thead>`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<thead data-component-part="header" {...rest}>{@render children()}</thead>
