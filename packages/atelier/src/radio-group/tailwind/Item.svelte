<script lang="ts" generics="V">
  import { Item } from '@kumiki/components/radio-group';
  import type { Snippet } from 'svelte';
  import type { RadioItem } from '@kumiki/components/radio-group';

  type Props = { value: RadioItem<V>; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item
  class={`relative inline-flex h-[1.0625rem] w-[1.0625rem] shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white shadow-[0_1px_1px_rgb(0_0_0_/_0.04),inset_0_1px_0_rgb(255_255_255_/_0.6)] transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-slate-400 data-[state=checked]:border-[1.25px] data-[state=checked]:border-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500 dark:data-[state=checked]:border-orange-500 dark:focus-visible:ring-offset-slate-950 motion-reduce:transition-none ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span
      class="block h-[0.5625rem] w-[0.5625rem] rounded-full bg-orange-600 opacity-0 shadow-[0_1px_2px_rgb(67_56_202_/_0.22)] transition-opacity duration-150 data-[state=checked]:opacity-100 dark:bg-orange-500"
      data-state={(rest as { 'data-state'?: string })['data-state']}
    ></span>{/if}
</Item>
