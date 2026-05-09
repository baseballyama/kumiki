<script lang="ts">
  import { Close } from '@kumiki/components/chips';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Close
  class={`-mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full opacity-60 hover:opacity-100 hover:bg-black/10 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">×</span>{/if}
</Close>
