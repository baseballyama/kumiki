<script lang="ts">
  import { Root } from '@kumiki/components/toolbar';
  import type { Snippet } from 'svelte';

  type Base = {
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props = Base & ({ 'aria-label': string } | { 'aria-labelledby': string });

  let { orientation = 'horizontal', children, class: className = '', ...rest }: Props = $props();
  const orientClass = $derived(
    orientation === 'vertical'
      ? 'inline-flex flex-col items-stretch gap-1 rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900'
      : 'inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900',
  );
</script>

<Root {orientation} class={`${orientClass} ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
