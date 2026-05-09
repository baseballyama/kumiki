<script lang="ts">
  import { Description } from '@kumiki/components/popover';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Description class={`text-sm text-slate-600 dark:text-slate-300 ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Description>
