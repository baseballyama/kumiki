<!--
  @component @kumiki/atelier/dialog Vanilla — Overlay scrim.
-->
<script lang="ts">
  import * as Dialog from '@kumiki/components/dialog';

  type Props = { class?: string; [k: string]: unknown };
  let { class: className = '', ...rest }: Props = $props();
</script>

<Dialog.Overlay class={`kumiki-dialog-overlay ${className}`.trim()} {...rest} />

<style>
  :global(.kumiki-dialog-overlay) {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: var(--kumiki-dialog-overlay-bg, oklch(0 0 0 / 0.6));
    animation: kumiki-overlay-in 150ms ease-out;
  }
  :global(.kumiki-dialog-overlay[data-state='closed']) {
    animation: kumiki-overlay-out 120ms ease-out forwards;
  }

  @keyframes kumiki-overlay-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes kumiki-overlay-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-dialog-overlay),
    :global(.kumiki-dialog-overlay[data-state='closed']) {
      animation: none;
    }
  }
</style>
