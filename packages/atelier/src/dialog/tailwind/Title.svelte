<!--
  @component @kumiki/atelier/dialog Tailwind — Title (heading inside Content).
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base =
    'm-0 text-[1.0625rem] font-[620] leading-[1.3] tracking-[-0.022em] text-slate-900 dark:text-slate-50';
</script>

<Dialog.Title class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Title>
