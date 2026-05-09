<script lang="ts" generics="V">
  import { Root } from '@kumiki/components/radio-group';
  import type { Snippet } from 'svelte';
  import type { RadioItem } from '@kumiki/components/radio-group';

  type Props = {
    items: ReadonlyArray<RadioItem<V>>;
    value?: V | null;
    defaultValue?: V | null;
    disabled?: boolean;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: V | null) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    items,
    value = $bindable(undefined),
    children,
    class: className = '',
    ...rest
  }: Props = $props();
</script>

<Root {items} bind:value class={`flex flex-col gap-2 ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
