<script lang="ts">
  import { Root } from '@kumiki/components/alert';
  import type { Snippet } from 'svelte';

  type Props = {
    severity?: 'info' | 'success' | 'warn' | 'error';
    live?: 'polite' | 'assertive' | 'off';
    dismissible?: boolean;
    onDismiss?: () => void;
    id?: string;
    icon?: Snippet;
    children?: Snippet;
    class?: string;
    [k: string]: unknown;
  };

  let { severity = 'info', children, class: className = '', ...rest }: Props = $props();

  const severityClasses = {
    info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100',
    success:
      'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
    warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
    error:
      'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100',
  } as const;
</script>

<Root
  {severity}
  class={`relative grid gap-1 rounded-md border p-4 text-sm ${severityClasses[severity]} ${className}`.trim()}
  {...rest}
>
  {#if children}{@render children()}{/if}
</Root>
