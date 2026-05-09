<script lang="ts" generics="V">
  import { Root } from '@kumiki/components/accordion';
  import type { Snippet } from 'svelte';
  import type { AccordionItem, AccordionMode } from '@kumiki/components/accordion';

  type Props = {
    items: ReadonlyArray<AccordionItem<V>>;
    mode?: AccordionMode;
    value?: ReadonlyArray<V> | V | null;
    defaultValue?: ReadonlyArray<V> | V | null;
    collapsible?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (expandedIds: ReadonlyArray<string>) => void;
    id?: string;
    children: Snippet;
    class?: string;
  };

  let {
    items,
    value = $bindable(undefined),
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<div
  class={`divide-y divide-slate-200 rounded-md border border-slate-200 dark:divide-slate-700 dark:border-slate-700 ${className}`.trim()}
>
  <Root {items} bind:value {...rest}>{@render children()}</Root>
</div>
