<script lang="ts">
  import { Content } from '@kumiki/components/tooltip';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content
  class={`z-50 max-w-xs rounded-md bg-slate-900 px-[0.6875rem] py-[0.4375rem] text-xs font-medium leading-snug tracking-[-0.003em] text-slate-50 shadow-[0_1px_2px_rgb(0_0_0_/_0.18),0_4px_12px_-2px_rgb(0_0_0_/_0.22),inset_0_1px_0_rgb(255_255_255_/_0.06)] dark:bg-slate-100 dark:text-slate-900 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-safe:data-[state=open]:duration-150 motion-safe:data-[state=closed]:duration-100 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Content>
