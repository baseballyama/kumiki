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
    --kumiki-chips-bg: hsl(220 10% 92%);
    --kumiki-chips-fg: hsl(220 10% 15%);
    --kumiki-chips-radius: 999px;
    --kumiki-chips-close-bg-hover: hsl(0 0% 0% / 0.1);

    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.625rem;
    border: 0;
    border-radius: var(--kumiki-chips-radius);
    background: var(--kumiki-chips-bg);
    color: var(--kumiki-chips-fg);
    font: inherit;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    cursor: default;
  }
  :global(.kumiki-chip[data-tone='info']) {
    --kumiki-chips-bg: hsl(200 90% 92%);
    --kumiki-chips-fg: hsl(200 90% 25%);
  }
  :global(.kumiki-chip[data-tone='success']) {
    --kumiki-chips-bg: hsl(140 50% 88%);
    --kumiki-chips-fg: hsl(140 60% 22%);
  }
  :global(.kumiki-chip[data-tone='warn']) {
    --kumiki-chips-bg: hsl(40 90% 88%);
    --kumiki-chips-fg: hsl(40 90% 25%);
  }
  :global(.kumiki-chip[data-tone='error']) {
    --kumiki-chips-bg: hsl(0 80% 92%);
    --kumiki-chips-fg: hsl(0 80% 30%);
  }
  :global(.kumiki-chip[data-variant='selectable']) {
    cursor: pointer;
  }
  :global(.kumiki-chip[data-pressed='true']) {
    box-shadow: 0 0 0 2px currentColor inset;
  }
  :global(.kumiki-chip [data-part='close']) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    margin-right: -0.25rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.6;
  }
  :global(.kumiki-chip [data-part='close']:hover) {
    background: var(--kumiki-chips-close-bg-hover);
    opacity: 1;
  }
</style>
