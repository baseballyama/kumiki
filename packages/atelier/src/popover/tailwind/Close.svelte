<script lang="ts">
  import { Close } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Close
  class={`absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded opacity-70 hover:opacity-100 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">×</span>{/if}
</Close>
