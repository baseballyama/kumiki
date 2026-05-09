<script lang="ts" generics="V">
  import { Item } from '@kumiki/components/radio-group';
  import type { Snippet } from 'svelte';
  import type { RadioItem } from '@kumiki/components/radio-group';

  type Props = { value: RadioItem<V>; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-slate-400 bg-white data-[state=checked]:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:data-[state=checked]:border-slate-100 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span
      class="block h-2 w-2 rounded-full bg-slate-900 opacity-0 data-[state=checked]:opacity-100 dark:bg-slate-100"
      data-state={(rest as { 'data-state'?: string })['data-state']}
    ></span>{/if}
</Item>
