<script lang="ts">
  import { Caption } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Caption class={`mt-4 text-sm text-slate-500 dark:text-slate-400 ${className}`.trim()} {...rest}>
  {@render children()}
</Caption>
