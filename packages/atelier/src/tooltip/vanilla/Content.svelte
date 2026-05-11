<script lang="ts">
  import { Content } from '@kumiki/components/tooltip';
  import type { Snippet } from 'svelte';

  type Props = { class?: string; children?: Snippet; [k: string]: unknown };
  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Content class={`kumiki-tooltip-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Content>

<style>
  :global(.kumiki-tooltip-content) {
    --kumiki-tooltip-bg: oklch(0.18 0.02 256);
    --kumiki-tooltip-fg: oklch(0.97 0.005 247);

    z-index: 50;
    max-width: 16rem;
    padding: 0.4375rem 0.6875rem;
    background: var(--kumiki-tooltip-bg);
    color: var(--kumiki-tooltip-fg);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: -0.003em;
    border-radius: 6px;
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.18),
      0 4px 12px -2px oklch(0 0 0 / 0.22),
      inset 0 1px 0 oklch(1 0 0 / 0.06);
    animation: kumiki-tooltip-in 160ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-tooltip-content[data-state='closed']) {
    animation: kumiki-tooltip-out 100ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  }
  @keyframes kumiki-tooltip-in {
    from {
      opacity: 0;
      transform: scale(0.94) translateY(2px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  @keyframes kumiki-tooltip-out {
    to {
      opacity: 0;
      transform: scale(0.96);
    }
  }
  :global {
    :root[data-theme='dark'] .kumiki-tooltip-content {
      --kumiki-tooltip-bg: oklch(0.93 0.006 247);
      --kumiki-tooltip-fg: oklch(0.18 0.02 256);
      box-shadow:
        0 1px 2px oklch(0 0 0 / 0.3),
        0 4px 12px -2px oklch(0 0 0 / 0.4);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-tooltip-content),
    :global(.kumiki-tooltip-content[data-state='closed']) {
      animation: none;
    }
  }
</style>
