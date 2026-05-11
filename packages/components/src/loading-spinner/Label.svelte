<!--
  @component LoadingSpinner.Label — semantic label for the spinner.

  Typically rendered inside `LoadingSpinner.Root`'s default children slot.
  Provided as a separate part so atelier / consumer styles can address
  the label independently from the surrounding wrapper.
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
