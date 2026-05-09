<script lang="ts">
  import { Label } from '@kumiki/components/chips';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Label class={className} {...rest}>{@render children()}</Label>
