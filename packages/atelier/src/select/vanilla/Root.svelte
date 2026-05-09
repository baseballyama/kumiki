<script lang="ts" generics="V">
  import { Root } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';
  import type { SelectItem } from '@kumiki/components/select';

  type Props = {
    items: ReadonlyArray<SelectItem<V>>;
    value?: V | null;
    open?: boolean;
    defaultValue?: V | null;
    defaultOpen?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: V | null) => void;
    onOpenChange?: (open: boolean) => void;
    id?: string;
    children: Snippet;
  };

  let {
    items,
    value = $bindable(undefined),
    open = $bindable(undefined),
    children,
    ...rest
  }: Props = $props();
</script>

<Root {items} bind:value bind:open {...rest}>{@render children()}</Root>
