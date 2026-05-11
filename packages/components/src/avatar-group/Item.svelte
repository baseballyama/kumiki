<!--
  @component AvatarGroup.Item — list item wrapping a single Avatar.

  Wraps in `<li>` so the role="list" + role="listitem" pair holds even
  when CSS sets `list-style: none` (which strips list semantics in
  WebKit).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    children: Snippet;
    [key: string]: unknown;
  };
  let { children, ...rest }: Props = $props();
</script>

<li role="listitem" data-component-part="item" {...rest}>{@render children()}</li>
