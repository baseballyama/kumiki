<!--
  @component @kumiki/atelier/icon-button Tailwind variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/icon-button';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    icon: Snippet;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    [k: string]: unknown;
  } & ({ 'aria-label': string } | { 'aria-labelledby': string });

  let { variant = 'ghost', size = 'md', icon, class: className = '', ...rest }: Props = $props();

  const variantClasses = {
    primary:
      'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400',
    secondary:
      'border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50',
    danger: 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40',
  } as const;
  const sizeClasses = {
    sm: 'h-8 w-8 rounded-[7px]',
    md: 'h-9 w-9 rounded-lg',
    lg: 'h-10 w-10 rounded-[9px]',
  } as const;
  const base =
    'inline-flex shrink-0 items-center justify-center transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100';
</script>

<Root
  {icon}
  class={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
/>
