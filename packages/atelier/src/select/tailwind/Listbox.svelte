<script lang="ts" generics="V">
  import { Listbox } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Listbox
  class={`z-50 min-w-[10rem] list-none overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-md outline-none dark:border-slate-700 dark:bg-slate-900 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Listbox>
