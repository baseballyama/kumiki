<!--
  @component @kumiki/atelier/dialog Vanilla — Description.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Dialog.Description class={`kumiki-dialog-description ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Dialog.Description>

<style>
  :global(.kumiki-dialog-description) {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.55;
    letter-spacing: -0.005em;
    color: var(--kumiki-dialog-muted, var(--kumiki-color-fg-muted));
  }
  :global {
    :root[data-theme='dark'] .kumiki-dialog-description {
      --kumiki-dialog-muted: var(--kumiki-color-fg-quiet);
    }
  }
</style>
