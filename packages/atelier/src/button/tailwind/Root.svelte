<!--
  @component @kumiki/atelier/button Tailwind variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/button';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon?: Snippet;
    iconTrailing?: Snippet;
    onclick?: (event: MouseEvent) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    variant = 'primary',
    size = 'md',
    icon,
    iconTrailing,
    children,
    class: className = '',
    ...rest
  }: Props = $props();

  const variantClasses = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200',
    secondary:
      'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800',
  } as const;
  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs gap-1',
    md: 'h-9 px-3 text-sm gap-1.5',
    lg: 'h-10 px-4 text-base gap-2',
  } as const;
  const base =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[loading]:opacity-80 dark:focus-visible:ring-slate-300';
</script>

<Root
  {icon}
  {iconTrailing}
  class={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Root>
