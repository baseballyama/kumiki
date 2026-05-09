<script lang="ts" generics="V">
  import { Option } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';
  import type { SelectItem } from '@kumiki/components/select';

  type Props = { value: SelectItem<V>; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Option
  class={`flex cursor-default select-none items-center rounded px-2 py-1.5 text-sm outline-none data-[active]:bg-slate-100 data-[selected]:font-semibold dark:data-[active]:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Option>
