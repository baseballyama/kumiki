<!--
  @component @kumiki/atelier/dialog Vanilla — Title.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Title class={`kumiki-dialog-title ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Title>

<style>
  :global(.kumiki-dialog-title) {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.025em;
  }
</style>
