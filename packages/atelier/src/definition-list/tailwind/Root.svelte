<script lang="ts">
  import { Root } from '@kumiki/components/definition-list';
  import type { Snippet } from 'svelte';

  type Props = {
    layout?: 'inline' | 'block';
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { layout = 'block', children, class: className = '', ...rest }: Props = $props();
  const layoutClass = $derived(
    layout === 'inline'
      ? 'grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm'
      : 'space-y-2 text-sm',
  );
</script>

<Root {layout} class={`${layoutClass} ${className}`.trim()} {...rest}>
  {@render children()}
</Root>
