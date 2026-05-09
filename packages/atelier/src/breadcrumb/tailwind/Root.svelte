<script lang="ts">
  import { Root } from '@kumiki/components/breadcrumb';
  import type { Snippet } from 'svelte';

  type Props = {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`text-sm text-slate-500 dark:text-slate-400 ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
