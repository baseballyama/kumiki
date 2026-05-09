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

<Trigger
  class={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
  <span aria-hidden="true" class="data-[state=open]:rotate-180 transition-transform">▾</span>
</Trigger>
