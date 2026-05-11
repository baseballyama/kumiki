<script lang="ts">
  import { Content } from '@kumiki/components/date-picker';
  import type { Snippet } from 'svelte';
  import type { CalendarDate } from '@internationalized/date';

  type CalendarArgs = {
    locale: string;
    selectDate: (date: CalendarDate) => void;
    value: CalendarDate | null;
  };
  type Props = {
    calendar?: Snippet<[CalendarArgs]>;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  let { children, class: className = '', ...rest }: Props = $props();
</script>

<Content class={`kumiki-date-picker-content ${className}`.trim()} {...rest}>
  {#if children}{@render children()}{/if}
</Content>

<style>
  :global(.kumiki-date-picker-content) {
    --kumiki-date-picker-bg: var(--kumiki-color-bg);
    --kumiki-date-picker-border: var(--kumiki-color-line);

    z-index: 50;
    padding: 0.875rem;
    background: var(--kumiki-date-picker-bg);
    border: 1px solid var(--kumiki-date-picker-border);
    border-radius: 12px;
    box-shadow:
      0 1px 2px oklch(0 0 0 / 0.04),
      0 8px 24px -4px color-mix(in oklab, var(--kumiki-color-accent) 12%, transparent),
      0 16px 40px -8px color-mix(in oklab, var(--kumiki-color-accent) 18%, transparent),
      0 0 0 1px oklch(0 0 0 / 0.03);
    outline: none;
    animation: kumiki-date-picker-in 200ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  @keyframes kumiki-date-picker-in {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  :global {
    :root[data-theme='dark'] .kumiki-date-picker-content {
      --kumiki-date-picker-bg: oklch(0.2 0.012 256);
      --kumiki-date-picker-border: var(--kumiki-color-fg);
      box-shadow:
        0 1px 2px oklch(0 0 0 / 0.22),
        0 8px 24px -4px oklch(0 0 0 / 0.4),
        0 16px 40px -8px oklch(0 0 0 / 0.5),
        0 0 0 1px oklch(1 0 0 / 0.04);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-date-picker-content) {
      animation: none;
    }
  }
</style>
