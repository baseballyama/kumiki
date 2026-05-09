<script lang="ts">
  import { Fallback } from '@kumiki/components/avatar';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Fallback
  class={`flex items-center justify-center select-none data-[hidden]:hidden ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Fallback>
