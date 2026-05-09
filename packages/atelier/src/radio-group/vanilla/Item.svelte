<script lang="ts" generics="V">
  import { Item } from '@kumiki/components/radio-group';
  import type { Snippet } from 'svelte';
  import type { RadioItem } from '@kumiki/components/radio-group';

  type Props = { value: RadioItem<V>; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Item>
