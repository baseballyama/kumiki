<!--
  @component @kumiki/atelier/dialog Tailwind — Title (heading inside Content).
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();

  const base = 'text-lg font-semibold leading-none tracking-tight';
</script>

<Dialog.Title class={`${base} ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Title>
