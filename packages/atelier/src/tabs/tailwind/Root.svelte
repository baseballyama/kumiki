<script lang="ts">
  import { Root } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';
  import type {
    TabItem,
    TabsActivation,
    TabsOrientation,
    TabsDirection,
  } from '@kumiki/components/tabs';

  type Props = {
    items: ReadonlyArray<TabItem>;
    value?: string | null;
    defaultValue?: string | null;
    disabled?: boolean;
    activation?: TabsActivation;
    orientation?: TabsOrientation;
    direction?: TabsDirection;
    navigation?: 'wrap' | 'clamp';
    onValueChange?: (value: string | null) => void;
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

<div class={`flex flex-col gap-2 ${className}`.trim()}>
  <Root {items} bind:value {...rest}>{@render children()}</Root>
</div>
