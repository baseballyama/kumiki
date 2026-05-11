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
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    warn: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    error: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
  } as const;
  const cls = $derived(
    `inline-flex items-center gap-1 rounded-full border border-black/[0.04] px-2.5 py-[0.1875rem] text-xs font-[550] leading-tight tracking-[-0.005em] transition-colors duration-150 ${toneClasses[tone]} data-[variant=selectable]:cursor-pointer data-[pressed=true]:bg-slate-900 data-[pressed=true]:text-slate-50 data-[pressed=true]:shadow-sm dark:border-white/[0.04] ${className}`.trim(),
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
