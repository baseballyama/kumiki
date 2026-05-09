<!--
  @component Breadcrumb.Item — `<li>` cell.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<li data-part="item" {...rest}>{@render children()}</li>
