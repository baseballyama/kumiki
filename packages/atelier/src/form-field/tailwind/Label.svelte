<script lang="ts">
  import { Label } from '@kumiki/components/form-field';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Label
  class={`text-[0.8125rem] font-[550] leading-[1.3] tracking-[-0.005em] text-slate-700 dark:text-slate-200 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Label>
