<script lang="ts">
  import { Root } from '@kumiki/components/avatar-group';
  import type { Snippet } from 'svelte';

  type Props = {
    max?: number;
    total?: number;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Root class={`flex -space-x-2 list-none m-0 p-0 ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
