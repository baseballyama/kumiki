<!--
  @component Chips.Label — visible text content of the chip.

  Splitting Label from Root lets atelier / consumers paint the text and
  the dismissible Close button independently while keeping the chip's
  visible name in one element.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    children: Snippet;
    [key: string]: unknown;
  };
  let { children, ...rest }: Props = $props();
</script>

<span data-component-part="label" {...rest}>{@render children()}</span>
