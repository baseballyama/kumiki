<script lang="ts">
  import { Root } from '@kumiki/components/number-field';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: number | null;
    defaultValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    pageStep?: number;
    disabled?: boolean;
    format?: (value: number) => string;
    parse?: (raw: string) => number | null | undefined;
    onValueChange?: (value: number | null) => void;
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { value = $bindable(undefined), children, class: className = '', ...rest }: Props = $props();
</script>

<Root
  bind:value
  class={`inline-flex items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[inset_0_1px_1px_rgb(0_0_0_/_0.025),0_1px_1px_rgb(0_0_0_/_0.02)] transition-[border-color,box-shadow] duration-150 hover:border-slate-300 focus-within:border-orange-500 focus-within:shadow-[0_0_0_3px_rgb(99_102_241_/_0.18),inset_0_1px_1px_rgb(0_0_0_/_0.025)] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:focus-within:border-orange-500 dark:focus-within:shadow-[0_0_0_3px_rgb(99_102_241_/_0.25),inset_0_1px_1px_rgb(0_0_0_/_0.1)] ${className}`.trim()}
  {...rest}
>
  {@render children()}
</Root>
