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
    primary: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900',
    secondary: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50',
    ghost:
      'bg-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-50 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  } as const;
  const sizeClasses = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-10 w-10' } as const;
  const base =
    'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300';
</script>

<Root
  {icon}
  class={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
  data-variant={variant}
  data-size={size}
  {...rest}
/>
