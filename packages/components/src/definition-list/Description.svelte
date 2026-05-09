<!--
  @component DefinitionList.Description — `<dd>` description cell.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    children: Snippet;
    [key: string]: unknown;
  };
  let { children, ...rest }: Props = $props();
</script>

<dd {...rest}>{@render children()}</dd>
