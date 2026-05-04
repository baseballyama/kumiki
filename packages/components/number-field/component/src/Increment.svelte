<!--
  @component NumberField.Increment — step-up button.

  Disabled automatically when the machine is disabled or the value is
  at the upper bound.
-->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import { NUMBER_FIELD_CONTEXT_KEY, type NumberFieldContextValue } from './context.js';

  type Props = {
    children?: Snippet;
    [key: string]: unknown;
  };

  let { children, ...rest }: Props = $props();

  const { controller } = getContext<NumberFieldContextValue>(NUMBER_FIELD_CONTEXT_KEY);
</script>

<button type="button" data-component-part="increment" {...rest} {@attach controller.increment_}>
  {#if children}{@render children()}{/if}
</button>
