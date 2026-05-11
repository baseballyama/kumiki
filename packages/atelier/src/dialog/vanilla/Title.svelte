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
    font-size: 1.0625rem;
    font-weight: 620;
    line-height: 1.3;
    letter-spacing: -0.022em;
    color: var(--kumiki-dialog-fg, oklch(0.18 0.02 256));
  }
  :global {
    :root[data-theme='dark'] .kumiki-dialog-title {
      color: oklch(0.98 0.004 247);
    }
  }
</style>
