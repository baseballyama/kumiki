<script lang="ts" generics="V">
  import { Option } from '@kumiki/components/select';
  import type { Snippet } from 'svelte';
  import type { SelectItem } from '@kumiki/components/select';

  type Props = { value: SelectItem<V>; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Option class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Option>
