<script lang="ts">
  import { List } from '@kumiki/components/tabs';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<List class={className} {...rest}>{@render children()}</List>
