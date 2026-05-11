<!--
  @component DefinitionList.Term — `<dt>` term cell.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    children: Snippet;
    [key: string]: unknown;
  };
  let { children, ...rest }: Props = $props();
</script>

<dt data-component-part="term" {...rest}>{@render children()}</dt>
