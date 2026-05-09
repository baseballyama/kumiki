<!--
  @component TimeField.Input — visual container for the segments.

  Pure layout helper. Adds `data-component-part="input"` so the atelier (or
  consumer CSS) can style the segment row consistently with native form
  inputs (border, padding, focus ring on `:focus-within`).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
</script>

<div {...rest} data-component-part="input">
  {#if children}{@render children()}{/if}
</div>
