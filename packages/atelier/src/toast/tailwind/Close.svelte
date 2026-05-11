<script lang="ts">
  import { Close } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Close
  class={`absolute right-[0.4375rem] top-[0.4375rem] inline-flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded-md opacity-55 transition-[opacity,background-color] duration-150 hover:bg-slate-100 hover:opacity-100 dark:hover:bg-slate-800 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{:else}<span aria-hidden="true">×</span>{/if}
</Close>
