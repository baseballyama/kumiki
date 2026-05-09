<script lang="ts">
  import { Root } from '@kumiki/components/slider';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    orientation?: 'horizontal' | 'vertical';
    direction?: 'ltr' | 'rtl';
    disabled?: boolean;
    onValueChange?: (value: number) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let {
    value = $bindable(undefined),
    orientation = 'horizontal',
    children,
    class: className = '',
    ...rest
  }: Props = $props();
  const orientClass = $derived(
    orientation === 'horizontal'
      ? 'relative h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700'
      : 'relative h-full w-1.5 rounded-full bg-slate-200 dark:bg-slate-700',
  );
</script>

<Root bind:value {orientation} class={`${orientClass} ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
