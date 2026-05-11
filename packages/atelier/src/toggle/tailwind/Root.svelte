<!--
  @component @kumiki/atelier/toggle Tailwind variant — opinionated styled
  Toggle built on top of `@kumiki/components/toggle`.

  Tailwind v4 utility classes. Reads `data-state` and `data-disabled` from
  the underlying primitive. Copy this file into your project via
  `kumiki add toggle --variant=tailwind` (Phase 1).
-->
<script lang="ts">
  import * as Toggle from '@kumiki/components/toggle';
  import type { Snippet } from 'svelte';

  type Props = {
    pressed?: boolean;
    defaultPressed?: boolean;
    disabled?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    id?: string;
    /** Visual size. Default: `md`. */
    size?: 'sm' | 'md' | 'lg';
    /** Visual style. Default: `default`. */
    variant?: 'default' | 'outline';
    children?: Snippet;
    /** Extra classes to merge after the variant base. */
    class?: string;
  };

  let {
    pressed = $bindable(undefined),
    defaultPressed,
    disabled,
    onPressedChange,
    id,
    size = 'md',
    variant = 'default',
    children,
    class: className = '',
  }: Props = $props();

  const sizeClasses = {
    sm: 'h-8 px-2.5 text-xs rounded-[7px]',
    md: 'h-9 px-3 text-[0.8125rem] rounded-lg',
    lg: 'h-10 px-4 text-[0.9375rem] rounded-[9px]',
  } as const;
  const innerGap = { sm: 'gap-1.5', md: 'gap-1.5', lg: 'gap-2' } as const;

  const variantClasses = {
    default: [
      'bg-transparent text-slate-700',
      'hover:bg-slate-100 hover:text-slate-900',
      'data-[state=on]:bg-slate-900 data-[state=on]:text-white data-[state=on]:shadow-[0_1px_2px_rgb(0_0_0_/_0.12),inset_0_1px_0_rgb(255_255_255_/_0.08)]',
      'data-[state=on]:hover:bg-slate-800',
      'dark:text-slate-300',
      'dark:hover:bg-slate-800 dark:hover:text-slate-50',
      'dark:data-[state=on]:bg-slate-50 dark:data-[state=on]:text-slate-900',
      'dark:data-[state=on]:hover:bg-slate-200',
    ].join(' '),
    outline: [
      'border border-slate-200 bg-transparent text-slate-700',
      'hover:bg-slate-50 hover:text-slate-900',
      'data-[state=on]:border-slate-900 data-[state=on]:bg-slate-900 data-[state=on]:text-white',
      'dark:border-slate-700 dark:text-slate-300',
      'dark:hover:bg-slate-800 dark:hover:text-slate-50',
      'dark:data-[state=on]:bg-slate-50 dark:data-[state=on]:text-slate-900',
    ].join(' '),
  } as const;

  const baseClasses =
    'inline-flex select-none items-center justify-center font-[550] tracking-[-0.005em] leading-none transition-[background-color,color,box-shadow] duration-150 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none';
</script>

<Toggle.Root
  bind:pressed
  {defaultPressed}
  {disabled}
  {onPressedChange}
  {id}
  class="{baseClasses} {sizeClasses[size]} {variantClasses[variant]} {className}"
>
  {#if children}<span
      class="inline-flex items-center justify-center {innerGap[
        size
      ]} leading-none [text-box:trim-both_cap_alphabetic]">{@render children()}</span
    >{/if}
</Toggle.Root>
