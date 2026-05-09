<script lang="ts">
  import { Viewport } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Viewport
  class={`pointer-events-none fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col-reverse gap-2 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Viewport>
