<script lang="ts">
  import { Description } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Description class={`text-sm opacity-90 ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Description>
