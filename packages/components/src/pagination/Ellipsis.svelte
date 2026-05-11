<!--
  @component Pagination.Ellipsis — decorative gap indicator.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = { children?: Snippet; [key: string]: unknown };
  let { children, ...rest }: Props = $props();
</script>

<span data-component-part="ellipsis" aria-hidden="true" {...rest}>
  {#if children}{@render children()}{:else}…{/if}
</span>
