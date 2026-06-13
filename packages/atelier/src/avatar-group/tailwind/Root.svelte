<script lang="ts">
  import { Root } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type BaseProps = {
    max?: number;
    total?: number;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  type Props = (BaseProps & { 'aria-label': string }) | (BaseProps & { 'aria-labelledby': string });

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`flex -space-x-2 list-none m-0 p-0 ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
