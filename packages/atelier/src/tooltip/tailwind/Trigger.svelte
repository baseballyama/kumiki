<script lang="ts">
  import { Trigger } from '@kumiki/components/tooltip';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Trigger
  class={`inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Trigger>
