<!--
  @component @kumiki/atelier/badge Tailwind variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/badge';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
    size?: 'sm' | 'md';
    decorative?: boolean;
    'aria-label'?: string;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    variant = 'neutral',
    size = 'md',
    children,
    class: className = '',
    ...rest
  }: Props = $props();

  const variantClasses = {
    neutral: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-50',
    info: 'bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-50',
    success: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-50',
    warn: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-50',
    error: 'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-50',
  } as const;
  const sizeClasses = {
    sm: 'h-4 px-1.5 text-[10px]',
    md: 'h-5 px-2 text-xs',
  } as const;
  const base =
    'inline-flex items-center justify-center rounded font-medium leading-none whitespace-nowrap';
</script>

<Root
  class={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Root>
