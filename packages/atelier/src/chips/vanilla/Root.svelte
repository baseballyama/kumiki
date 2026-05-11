<script lang="ts">
  import { Root } from '@kumiki/components/chips';
  import type { Snippet } from 'svelte';

  type CommonProps = {
    /** Visual tone (atelier-only). Maps to `--kumiki-chips-bg/-fg` palette via `data-tone`. */
    tone?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
    id?: string;
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props =
    | (CommonProps & { variant?: 'static' })
    | (CommonProps & { variant: 'dismissible'; label: string; onDismiss: () => void })
    | (CommonProps & {
        variant: 'selectable';
        pressed: boolean;
        onPressedChange: (v: boolean) => void;
        disabled?: boolean;
      });

  let props: Props = $props();
  const tone = $derived(props.tone ?? 'neutral');
  const className = $derived((props.class ?? '') as string);
  const cls = $derived(`kumiki-chip ${className}`.trim());
</script>

{#if 'variant' in props && props.variant === 'dismissible'}
  {@const { tone: _t, class: _cls, children, ...rest } = props}
  <Root data-tone={tone} class={cls} {...rest}>{@render children()}</Root>
{:else if 'variant' in props && props.variant === 'selectable'}
  {@const { tone: _t, class: _cls, children, ...rest } = props}
  <Root data-tone={tone} class={cls} {...rest}>{@render children()}</Root>
{:else}
  {@const { tone: _t, class: _cls, children, ...rest } = props}
  <Root data-tone={tone} class={cls} {...rest}>{@render children()}</Root>
{/if}

<style>
  :global(.kumiki-chip) {
    --kumiki-chips-bg: var(--kumiki-color-surface);
    --kumiki-chips-fg: oklch(0.28 0.018 256);
    --kumiki-chips-radius: 999px;
    --kumiki-chips-close-bg-hover: oklch(0 0 0 / 0.08);

    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.1875rem 0.625rem;
    border: 1px solid oklch(0 0 0 / 0.04);
    border-radius: var(--kumiki-chips-radius);
    background: var(--kumiki-chips-bg);
    color: var(--kumiki-chips-fg);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 550;
    letter-spacing: -0.005em;
    line-height: 1.1;
    cursor: default;
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      box-shadow 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-chip[data-tone='info']) {
    --kumiki-chips-bg: oklch(0.94 0.04 240);
    --kumiki-chips-fg: oklch(0.34 0.13 240);
  }
  :global(.kumiki-chip[data-tone='success']) {
    --kumiki-chips-bg: oklch(0.92 0.05 152);
    --kumiki-chips-fg: oklch(0.32 0.1 152);
  }
  :global(.kumiki-chip[data-tone='warn']) {
    --kumiki-chips-bg: oklch(0.93 0.06 78);
    --kumiki-chips-fg: oklch(0.38 0.11 78);
  }
  :global(.kumiki-chip[data-tone='error']) {
    --kumiki-chips-bg: oklch(0.93 0.06 25);
    --kumiki-chips-fg: oklch(0.42 0.16 25);
  }
  :global(.kumiki-chip[data-variant='selectable']) {
    cursor: pointer;
  }
  :global(.kumiki-chip[data-variant='selectable']:hover:not([data-disabled])) {
    background: color-mix(in oklch, var(--kumiki-chips-bg), oklch(0 0 0 / 0.05));
  }
  :global(.kumiki-chip[data-pressed='true']) {
    background: var(--kumiki-chips-fg);
    color: var(--kumiki-chips-bg);
    box-shadow: 0 1px 2px oklch(0 0 0 / 0.15);
  }
  :global(.kumiki-chip [data-component-part='close']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    margin-right: -0.25rem;
    margin-left: 0.0625rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.55;
    transition:
      background-color 140ms cubic-bezier(0.32, 0.72, 0, 1),
      opacity 140ms cubic-bezier(0.32, 0.72, 0, 1);
  }
  :global(.kumiki-chip [data-component-part='close']:hover) {
    background: var(--kumiki-chips-close-bg-hover);
    opacity: 1;
  }
  :global {
    :root[data-theme='dark'] .kumiki-chip {
      --kumiki-chips-bg: var(--kumiki-color-surface-raised);
      --kumiki-chips-fg: var(--kumiki-color-fg-muted);
      --kumiki-chips-close-bg-hover: oklch(1 0 0 / 0.08);
      border-color: oklch(1 0 0 / 0.04);
    }
    :root[data-theme='dark'] .kumiki-chip[data-tone='info'] {
      --kumiki-chips-bg: oklch(0.3 0.06 240);
      --kumiki-chips-fg: oklch(0.78 0.1 240);
    }
    :root[data-theme='dark'] .kumiki-chip[data-tone='success'] {
      --kumiki-chips-bg: oklch(0.3 0.06 152);
      --kumiki-chips-fg: oklch(0.8 0.1 152);
    }
    :root[data-theme='dark'] .kumiki-chip[data-tone='warn'] {
      --kumiki-chips-bg: oklch(0.32 0.08 78);
      --kumiki-chips-fg: oklch(0.82 0.12 78);
    }
    :root[data-theme='dark'] .kumiki-chip[data-tone='error'] {
      --kumiki-chips-bg: oklch(0.3 0.1 25);
      --kumiki-chips-fg: oklch(0.78 0.14 25);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.kumiki-chip),
    :global(.kumiki-chip [data-component-part='close']) {
      transition: none;
    }
  }
</style>
