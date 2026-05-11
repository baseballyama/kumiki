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
    background: var(--kumiki-dialog-overlay-bg, oklch(0.16 0.012 256 / 0.55));
    backdrop-filter: blur(6px) saturate(140%);
    -webkit-backdrop-filter: blur(6px) saturate(140%);
    animation: kumiki-overlay-in 220ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-dialog-overlay[data-state='closed']) {
    animation: kumiki-overlay-out 160ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
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
