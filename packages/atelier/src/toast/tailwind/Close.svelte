<script lang="ts">
  import { Close } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Close
  class={`absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded opacity-60 hover:opacity-100 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">×</span>{/if}
</Close>
