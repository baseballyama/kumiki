<!--
  @component Table.Cell — `<td>`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children?: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<td data-component-part="cell" {...rest}
  >{#if children}{@render children()}{/if}</td
>
