<script lang="ts" generics="V">
  import { Option } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';
  import type { SelectItem } from '@kumiki/components/select';

  type Props = { value: SelectItem<V>; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Option
  class={`flex cursor-default select-none items-center rounded-md px-2.5 py-[0.4375rem] text-[0.8125rem] font-medium tracking-[-0.005em] text-slate-900 outline-none transition-colors duration-100 data-[active]:bg-slate-100 data-[selected]:font-semibold data-[selected]:text-orange-600 data-[selected]:after:ml-auto data-[selected]:after:content-['✓'] data-[selected]:after:font-bold dark:text-slate-50 dark:data-[active]:bg-slate-800 dark:data-[selected]:text-orange-400 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Option>
