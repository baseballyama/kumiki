<script lang="ts">
  import { Item } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Item class={`ring-2 ring-white dark:ring-slate-900 rounded-full ${className}`.trim()} {...rest}>
  {@render children()}
</Item>
