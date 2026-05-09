<!--
  @component DateTimeField.Label — wrapping `<label>` for the field group.

  Layer 4 leaves visual styling to atelier; this part exists so the dot-
  namespace API is symmetric with TimeField / FormField.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();
</script>

<label {...rest} data-component-part="label">
  {#if children}{@render children()}{/if}
</label>
