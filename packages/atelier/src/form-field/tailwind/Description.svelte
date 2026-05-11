<script lang="ts">
  import { Description } from '@kumiki/components/form-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Description
  class={`text-xs leading-relaxed text-slate-500 dark:text-slate-400 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Description>
