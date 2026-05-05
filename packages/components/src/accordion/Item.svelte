<!--
  @component Accordion.Item — wrapper for one panel + its trigger.

  Renders a `<section>`; children are typically `<Trigger>` and `<Panel>`.
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
  const attachment = controller.item(value);
</script>

<section {...rest} {@attach attachment}>
  {#if children}{@render children()}{/if}
</section>
