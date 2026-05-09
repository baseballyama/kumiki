<script lang="ts" generics="V">
  import { Panel } from '@kumiki/components/accordion';
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

<Panel
  class={`px-4 pb-3 pt-0 text-sm text-slate-600 dark:text-slate-300 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Panel>
