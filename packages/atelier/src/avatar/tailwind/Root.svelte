<script lang="ts">
  import { Root } from '@kumiki/components/avatar';
  import type { Snippet } from 'svelte';

  type CommonProps = {
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
    class?: string;
    [k: string]: unknown;
  };
  type Props =
    | (CommonProps & { decorative: true; name?: undefined })
    | (CommonProps & { name: string; decorative?: false });

  let props: Props = $props();
  const size = $derived(props.size ?? 'md');
  const className = $derived((props.class ?? '') as string);
  const sizeClasses = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' };
</script>

{#if props.decorative === true}
  {@const { class: _cls, children, decorative: _d, size: _s, ...rest } = props}
  <Root
    decorative
    class={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200 ${sizeClasses[size]} ${className}`.trim()}
    data-size={size}
    {...rest}
  >
    {@render children()}
  </Root>
{:else}
  {@const { class: _cls, children, name, size: _s, ...rest } = props}
  <Root
    {name}
    class={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200 ${sizeClasses[size]} ${className}`.trim()}
    data-size={size}
    {...rest}
  >
    {@render children()}
  </Root>
{/if}
