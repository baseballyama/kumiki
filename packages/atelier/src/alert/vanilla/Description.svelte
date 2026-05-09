<script lang="ts">
  import { Description } from '@kumiki/components/alert';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Description class={className} {...rest}>{@render children()}</Description>
