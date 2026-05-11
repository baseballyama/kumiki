<script lang="ts">
  import { Description } from '@kumiki/components/toast';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Description
  class={`text-[0.8125rem] leading-[1.5] text-slate-600 dark:text-slate-400 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Description>
