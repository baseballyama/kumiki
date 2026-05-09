<script lang="ts">
  import { Footer } from '@kumiki/components/table';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Footer class={className} {...rest}>{@render children()}</Footer>
