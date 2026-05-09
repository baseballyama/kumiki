<script lang="ts" generics="V">
  import { Trigger } from '@kumiki/components/accordion';
  import type { Snippet } from 'svelte';
  import type { AccordionItem as AccordionItemType } from '@kumiki/components/accordion';

  type Props = {
    value: AccordionItemType<V>;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Trigger class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Trigger>
