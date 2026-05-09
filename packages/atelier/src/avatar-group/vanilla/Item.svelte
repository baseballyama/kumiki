<script lang="ts">
  import { Item } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item class={className} {...rest}>{@render children()}</Item>
