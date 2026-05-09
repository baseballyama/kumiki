<script lang="ts">
  import { Input } from '@kumiki/components/time-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Input class={className} {...rest}>
  {#if children}{@render children()}{/if}
</Input>
