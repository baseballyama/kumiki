<script lang="ts">
  import { List } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<List
  class={`inline-flex h-9 items-center border-b border-slate-200 dark:border-slate-700 ${className}`.trim()}
  {...rest}
>
  {@render children()}
</List>
