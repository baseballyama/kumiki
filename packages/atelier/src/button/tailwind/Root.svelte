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
      'bg-orange-600 text-white shadow-[0_1px_2px_rgb(67_56_202_/_0.22),inset_0_1px_0_rgb(255_255_255_/_0.08)] hover:bg-orange-700 active:bg-orange-800 active:translate-y-[0.5px] dark:bg-orange-500 dark:hover:bg-orange-400',
    secondary:
      'border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-900 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-50 dark:hover:bg-slate-800 dark:active:bg-slate-700',
    danger:
      'bg-rose-600 text-white shadow-[0_1px_2px_rgb(159_18_57_/_0.22),inset_0_1px_0_rgb(255_255_255_/_0.08)] hover:bg-rose-700 active:bg-rose-800 active:translate-y-[0.5px]',
  } as const;
  const sizeClasses = {
    sm: 'h-8 px-[0.6875rem] text-xs gap-1.5 rounded-[7px]',
    md: 'h-9 px-3.5 text-[0.8125rem] gap-2 rounded-lg',
    lg: 'h-10 px-[1.125rem] text-[0.9375rem] gap-2 rounded-[9px]',
  } as const;
  const base =
    'relative inline-flex select-none items-center justify-center font-[550] tracking-[-0.005em] leading-none whitespace-nowrap transition-[background-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 data-[loading]:cursor-progress motion-reduce:transition-none';
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
