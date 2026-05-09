<!--
  @component @kumiki/atelier/dialog Vanilla — Trigger button.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Trigger class={`kumiki-dialog-trigger ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Trigger>

<style>
  :global(.kumiki-dialog-trigger) {
    display: inline-flex;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    padding-inline: 0.75rem;
    border: 0;
    border-radius: 0.375rem;
    background: var(--kumiki-dialog-trigger-bg, oklch(0.2 0 0));
    color: var(--kumiki-dialog-trigger-fg, oklch(0.98 0 0));
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
    transition: background-color 120ms ease;
  }
  :global(.kumiki-dialog-trigger:hover) {
    background: var(--kumiki-dialog-trigger-bg-hover, oklch(0.32 0 0));
  }
  :global(.kumiki-dialog-trigger:focus-visible) {
    outline: 0;
    box-shadow:
      0 0 0 2px var(--kumiki-dialog-ring-offset, oklch(1 0 0)),
      0 0 0 4px var(--kumiki-dialog-ring, oklch(0.55 0.18 252));
  }
</style>
