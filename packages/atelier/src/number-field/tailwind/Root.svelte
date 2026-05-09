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
  class={`inline-flex items-stretch overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 ${className}`.trim()}
  {...rest}
>
  {@render children()}
</Root>
