<!--
  @component @kumiki/atelier/loading-spinner Tailwind variant.
-->
<script lang="ts">
  import { Root } from '@kumiki/components/loading-spinner';
  import type { Snippet } from 'svelte';

  type Props = {
    mode?: 'inline' | 'region';
    size?: 'sm' | 'md' | 'lg';
    spinner?: Snippet;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { mode = 'inline', size = 'md', children, class: className = '', ...rest }: Props = $props();

  const sizeClasses = { sm: 'gap-1 text-xs', md: 'gap-1.5 text-sm', lg: 'gap-2 text-base' };
</script>

<Root
  {mode}
  class={`inline-flex items-center ${sizeClasses[size]} ${className}`.trim()}
  data-size={size}
  {...rest}
>
  {#snippet spinner()}
    <span
      class="kumiki-tw-spinner inline-block rounded-full border-2 border-slate-300 border-t-slate-900 motion-reduce:animate-none"
    ></span>
  {/snippet}
  {#if children}{@render children()}{/if}
</Root>

<style>
  :global(.kumiki-tw-spinner) {
    width: 1em;
    height: 1em;
    animation: kumiki-tw-spin 0.7s linear infinite;
  }
  @keyframes kumiki-tw-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
