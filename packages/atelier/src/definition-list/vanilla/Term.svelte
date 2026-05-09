<script lang="ts">
  import { Term } from '@kumiki/components/definition-list';
  import type { Snippet } from 'svelte';

  type Props = { children: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Term class={className} {...rest}>{@render children()}</Term>
