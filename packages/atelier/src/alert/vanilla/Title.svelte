<script lang="ts">
  import { Title } from '@kumiki/components/alert';
  import type { Snippet } from 'svelte';

  type Props = {
    level?: 2 | 3 | 4 | 5 | 6;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Title class={className} {...rest}>{@render children()}</Title>
