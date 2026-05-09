<script lang="ts">
  import { Root } from '@kumiki/components/chips';
  import type { Snippet } from 'svelte';

  type CommonProps = {
    /** Visual tone (atelier-only). Maps to background/foreground palette. */
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
  const toneClasses = {
    neutral: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
    info: 'bg-sky-100 text-sky-900 dark:bg-sky-900 dark:text-sky-50',
    success: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-50',
    warn: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-50',
    error: 'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-50',
  } as const;
  const cls = $derived(
    `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]} data-[selected]:ring-2 data-[selected]:ring-current ${className}`.trim(),
  );
</script>

{#if 'variant' in props && props.variant === 'dismissible'}
  {@const { tone: _t, class: _cls, children, ...rest } = props}
  <Root class={cls} {...rest}>{@render children()}</Root>
{:else if 'variant' in props && props.variant === 'selectable'}
  {@const { tone: _t, class: _cls, children, ...rest } = props}
  <Root class={cls} {...rest}>{@render children()}</Root>
{:else}
  {@const { tone: _t, class: _cls, children, ...rest } = props}
  <Root class={cls} {...rest}>{@render children()}</Root>
{/if}
