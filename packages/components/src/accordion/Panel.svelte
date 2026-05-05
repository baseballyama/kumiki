<!--
  @component Accordion.Panel — the content region for one item.

  Hidden when the item is collapsed via the `hidden` attribute. Consumers
  can override visibility with CSS for a fade-in/slide-down transition,
  but `hidden` is what the APG pattern asks for.
-->
<script lang="ts" generics="V">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import {
    ACCORDION_CONTEXT_KEY,
    type AccordionContextValue,
    type AccordionItem,
  } from './context.js';

  type Props = {
    value: AccordionItem<V>;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { value, children, ...rest }: Props = $props();

  const { controller } = getContext<AccordionContextValue<V>>(ACCORDION_CONTEXT_KEY);
  // svelte-ignore state_referenced_locally
  const attachment = controller.panel(value);
</script>

<div {...rest} {@attach attachment}>
  {#if children}{@render children()}{/if}
</div>
