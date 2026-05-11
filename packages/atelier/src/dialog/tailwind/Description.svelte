<!--
  @component @kumiki/atelier/dialog Tailwind — Description (body copy under Title).
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base = 'm-0 text-sm leading-relaxed tracking-[-0.005em] text-slate-600 dark:text-slate-400';
</script>

<Dialog.Description class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Description>
