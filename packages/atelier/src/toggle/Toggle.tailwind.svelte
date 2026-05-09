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
    sm: 'h-8 px-2 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-3.5 text-base',
  } as const;

  const variantClasses = {
    default: [
      'bg-transparent',
      'hover:bg-slate-100 hover:text-slate-900',
      'data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900',
      'dark:hover:bg-slate-800 dark:hover:text-slate-50',
      'dark:data-[state=on]:bg-slate-700 dark:data-[state=on]:text-slate-50',
    ].join(' '),
    outline: [
      'border border-slate-200 bg-transparent',
      'hover:bg-slate-100 hover:text-slate-900',
      'data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900',
      'dark:border-slate-700',
      'dark:hover:bg-slate-800 dark:hover:text-slate-50',
      'dark:data-[state=on]:bg-slate-700 dark:data-[state=on]:text-slate-50',
    ].join(' '),
  } as const;

  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300';
</script>

<Toggle.Root
  bind:pressed
  {defaultPressed}
  {disabled}
  {onPressedChange}
  {id}
  class="{baseClasses} {sizeClasses[size]} {variantClasses[variant]} {className}"
>
  {#if children}{@render children()}{/if}
</Toggle.Root>
