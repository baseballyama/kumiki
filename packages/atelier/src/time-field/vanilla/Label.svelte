<script lang="ts">
  import { Label } from '@kumiki/components/time-field';
  import type { Snippet } from 'svelte';

  type Props = { id?: string; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Label class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Label>
