<script lang="ts">
  import { Label } from '@kumiki/components/time-field';
  import type { Snippet } from 'svelte';

  type Props = { id?: string; children?: Snippet; class?: string; [k: string]: unknown };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Label
  class={`text-sm font-medium text-slate-700 dark:text-slate-200 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Label>
