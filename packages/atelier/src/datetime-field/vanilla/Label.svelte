<script lang="ts">
  import { Label } from '@kumiki/components/datetime-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Label class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Label>
