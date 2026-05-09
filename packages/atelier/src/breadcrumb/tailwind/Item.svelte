<script lang="ts">
  import { Item } from '@kumiki/components/breadcrumb';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item class={`inline-flex items-center ${className}`.trim()} {...rest}>{@render children()}</Item>
