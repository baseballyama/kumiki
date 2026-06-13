<!--
  @component Accordion.Trigger — the focusable header button.
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
  const attachment = controller.trigger(value);
</script>

<button
  {...rest}
  type="button"
  id={controller.triggerElementId(value.id)}
  aria-controls={controller.panelElementId(value.id)}
  {@attach attachment}
>
  {#if children}{@render children()}{/if}
</button>
