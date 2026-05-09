<script lang="ts" generics="T extends ComboboxOption">
  import { Root } from '@kumiki/components/combobox';
  import type { Snippet } from 'svelte';
  import type { ComboboxOption } from '@kumiki/components/combobox';

  type Props = {
    options?: ReadonlyArray<T>;
    value?: T | null;
    defaultValue?: T | null;
    defaultQuery?: string;
    disabled?: boolean;
    pageSize?: number;
    filter?: (options: ReadonlyArray<T>, query: string) => ReadonlyArray<T>;
    onValueChange?: (value: T | null) => void;
    onOpenChange?: (open: boolean) => void;
    onQueryChange?: (query: string) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<div class={`relative inline-flex flex-col gap-1 ${className}`.trim()}>
  <Root bind:value {...rest}>{@render children()}</Root>
</div>
