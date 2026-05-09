<script lang="ts">
  import { Root } from '@kumiki/components/pagination';
  import type { Snippet } from 'svelte';

  type Props = {
    page: number;
    pageCount: number;
    siblingCount?: number;
    boundaryCount?: number;
    asLinks?: { href: (page: number) => string };
    onPageChange?: (page: number) => void;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`flex items-center gap-1 text-sm ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
